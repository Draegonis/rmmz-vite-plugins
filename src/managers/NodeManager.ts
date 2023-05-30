import { TITLE } from "../game";
import DdmNodeWorker from "../workers/node?worker";
// Store
import { set, get } from "idb-keyval";
import { inflate, deflate } from "pako";
// Helpers
import { isEmpty } from "ramda";
import { setGameVariables } from "../helpers/gameFuncs";
import { v4 as uuidV4 } from "uuid";
// Types
import type {
  DdmCalender,
  DdmNodeEvent,
  DdmNodeMapEvent,
  DdmNodeVarEvent,
  DdmNodeCustomEvent,
  DdmNodeSwitchEvent,
  DdmNodeWorkerReturn,
  DdmNodeEventTracked,
} from "../types/ddmTypes";
import type { DdmGameState } from "../enums/state";

const isNodeMapEvent = (data: DdmNodeEvent): data is DdmNodeMapEvent => {
  return (data as DdmNodeMapEvent).type === "mapEvent";
};
const isNodeSwitch = (data: DdmNodeEvent): data is DdmNodeSwitchEvent => {
  return (data as DdmNodeSwitchEvent).type === "switch";
};
const isNodeVariable = (data: DdmNodeEvent): data is DdmNodeVarEvent => {
  return (data as DdmNodeVarEvent).type === "variable";
};
const isNodeCustom = (data: DdmNodeEvent): data is DdmNodeCustomEvent => {
  return (data as DdmNodeCustomEvent).type === "custom";
};

// ===================================================
//                MANAGER

class DdmNodeManager {
  isGameBusy: boolean = false;

  #worker: Worker | undefined;
  #workInProgress: boolean = false;

  #interval: number | undefined = undefined;
  #seconds: number = 0;
  #secondsPerTick: number;

  #autoTick: boolean = true;
  #tick: number = 0;
  get _tick() {
    return this.#tick;
  }

  #tickEvents: DdmNodeEvent[] = [];
  get _tickEvents() {
    return this.#tickEvents;
  }
  #trackedEvents: DdmNodeEventTracked = {};
  get _trackedEvents() {
    return this.#trackedEvents;
  }

  #eventCache: DdmNodeEvent[] = [];

  // #calender: DdmCalender;
  // #currentDay = 1;
  // #currentWeek = 1;
  // #currentMonth = 1;

  constructor(_calender: DdmCalender, secondsPerTick: number) {
    this.#secondsPerTick = secondsPerTick;
    // this.#calender = calender;
    this.#worker = undefined;
  }

  /**
   * The method to start the game tick.
   */
  start() {
    if (!this.#worker) this.#initWorker();
    if (!this.#interval) {
      this.#interval = window.setInterval(() => {
        this.#seconds++;
        if (this.#seconds === this.#secondsPerTick) {
          this.#seconds = 0;
          this.#tick++;
          this.#incrementTick();

          console.log("Tick: ", this.#tick);
        }
      }, 1000);
    }
  }
  /**
   * The method to stop game tick.
   */
  stop() {
    if (this.#worker) this.#terminateWorker();

    if (this.#interval) {
      clearInterval(this.#interval);
      this.#interval = undefined;
    }
  }
  /**
   * A method to resume the automatic start/stop of the tick when switching scenes.
   */
  resumeAutoTick() {
    this.#autoTick = true;
  }
  /**
   * A method to pause the automatic start/stop of the tick when switching scenes.
   */
  pauseAutoTick() {
    this.#autoTick = false;
  }
  /**
   *
   */
  windowTickState(state: boolean) {
    if (!this.#autoTick) return;
    if (state) {
      this.tickState(DdmApi.Core.gameState);
    } else {
      if (this.#worker || this.#interval) this.stop();
    }
  }
  /**
   * A method to automatically start/stop ticks. It is called in the CoreManager when gameState is set.
   * @param {DdmGameState} gameState - the game state that the game is currently in.
   */
  tickState(gameState: DdmGameState) {
    if (!this.#autoTick) return;
    if (gameState === "map" || gameState === "custom") this.start();
    else this.stop();
  }
  /**
   * The method called to save the data to the save file.
   */
  async onSave(saveName: string) {
    const saveFileName = `${TITLE} File-${saveName}`;

    const saveData = {
      events: this.#tickEvents,
      tracked: this.#trackedEvents,
    };

    saveData.events.push({ id: "storeTick", type: "custom", tick: this.#tick });

    const str = JSON.stringify(saveData);
    const compressed = deflate(str);
    await set(saveFileName, compressed);
  }
  // /**
  //  * The method called to load data from the save file.
  //  */
  async onLoad(saveName: string) {
    const saveFileName = `${TITLE} File-${saveName}`;

    const str = await get(saveFileName);
    const restored = inflate(str, { to: "string" });
    const storedData = JSON.parse(restored) as {
      events: DdmNodeEvent[];
      tracked: DdmNodeEventTracked;
    };

    const gameTick = storedData.events.pop();
    if (gameTick) {
      const { tick } = gameTick;
      this.#tick = tick;
    } else {
      this.#tick = 0;
    }

    await this.#setEventData(storedData.events, storedData.tracked);
  }
  /**
   * The method to add an event to the tick que.
   * @param {number} toTick - the tick to schedule the event for.
   * @param {DdmNodeEvent} eventObj - the event object with id, type and function to call.
   */
  scheduleEvent(eventObj: DdmNodeEvent) {
    if (this.#workInProgress) {
      this.#eventCache.push(eventObj);
      return;
    }

    if (eventObj.tick < 1) return;

    this.#tickEvents.push(eventObj);
  }
  /**
   * The method to clear then entire tick que.
   */
  clearEvents() {
    this.#tickEvents.length = 0;
    Object.keys(this.#trackedEvents).forEach((key) => {
      delete this.#trackedEvents[key];
    });
  }
  /**
   * A method to create a new worker instance.
   */
  #initWorker() {
    this.#worker = new DdmNodeWorker();

    this.#worker.onmessage = async ({ data }: DdmNodeWorkerReturn) => {
      const { eventsToFire, newEvents, newTracked } = data;

      console.log(newEvents, newTracked);

      this.#workInProgress = false;
      this.#setEventData(newEvents, newTracked);
      if (eventsToFire) this.#onWorkFinished(eventsToFire);
    };
  }
  /**
   * A method to shutdown the worker and clear it.
   */
  #terminateWorker() {
    if (!this.#worker) return;
    this.#worker.terminate();
    this.#worker = undefined;
  }
  /**
   *
   */
  async #incrementTick() {
    if (!isEmpty(this.#tickEvents)) {
      this.#workInProgress = true;

      if (!this.#worker) {
        console.log(
          "Tried to increment the tick but the worker is not initialized."
        );
        return;
      }

      this.#worker.postMessage(this.#tickEvents);
    }
  }
  /**
   *
   */
  async #setEventData(
    newEvents: DdmNodeEvent[],
    newTracked: DdmNodeEventTracked
  ) {
    if (!isEmpty(newTracked)) {
      Object.assign(this.#trackedEvents, newTracked);
    }

    this.#tickEvents.length = 0;
    this.#tickEvents = newEvents;
  }
  /**
   * A method that schedules the cached events when the worker is finished.
   */
  async #onWorkFinished(eventsToFire: DdmNodeEvent[]) {
    console.log("Your fired: ", eventsToFire);
    for (const toExecute of eventsToFire) {
      this.#executeEvent(toExecute);
    }

    eventsToFire.length = 0;

    if (isEmpty(this.#eventCache)) return;

    console.log("Cache with: ", this.#eventCache);

    this.#eventCache.forEach((event) => {
      this.scheduleEvent(event);
    });

    this.#eventCache.length = 0;

    console.log("Resulting events: ", this.#tickEvents);
  }
  /**
   *
   */
  async #executeEvent(toExecute: DdmNodeEvent) {
    if (isNodeMapEvent(toExecute)) {
      const { eventId, eventMap } = toExecute;
      console.log(eventId, eventMap);
      return;
    }
    if (isNodeSwitch(toExecute)) {
      const { switchId, newValue } = toExecute;
      setGameVariables.switch(switchId, newValue);
      return;
    }
    if (isNodeVariable(toExecute)) {
      const { variableId, newValue } = toExecute;
      setGameVariables.var(variableId, newValue);
      return;
    }
    if (isNodeCustom(toExecute)) {
      return;
    }
  }
  /**
   * A method to create items quickly for stress testing.
   * @param {number} amount - the amount of total items to schedule.
   * @param {number} toTick - the items spread over the next 1 - toTick.
   * @param {boolean | undefined} someTrackable - make some items trackable.
   */
  stressTest(amount: number, toTick: number, someTrackable?: boolean) {
    const uuid = uuidV4();

    for (let x = 0; x < amount; x++) {
      const randTick = Math.floor(Math.random() * toTick) + 1;
      const id = `${uuid}` + "-" + x;

      let randomBool = undefined;

      if (someTrackable) {
        randomBool = Math.random() < 0.15;
      }

      this.scheduleEvent({
        id,
        type: "custom",
        tick: randTick,
        isTrackable: randomBool,
      });
    }
    console.log("Events: ", this.#tickEvents);
  }
}

// ===================================================
//                   EXPORT

export { DdmNodeManager };
