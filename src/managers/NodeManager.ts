import DdmNodeWorker from "../workers/node?worker";
// Helpers
import { isEmpty } from "ramda";
import { setGameVariables } from "../helpers/gameFuncs";
import { v4 as uuidV4 } from "uuid";
// Enums
import { GAME_STATE, WINDOW_STATE } from "../enums/state";
// Types
import type {
  DdmCalendar,
  DdmNodeEvent,
  DdmNodeMapEvent,
  DdmNodeVarEvent,
  DdmNodeCustomEvent,
  DdmNodeSwitchEvent,
  DdmNodeWorkerReturn,
  DdmNodeEventTracked,
  DdmNodeSaveData,
} from "../types/ddmTypes";

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

  // #calendar: DdmCalendar;
  // #currentDay = 1;
  // #currentWeek = 1;
  // #currentMonth = 1;

  constructor(_calendar: DdmCalendar, secondsPerTick: number) {
    this.#secondsPerTick = secondsPerTick;
    // this.#calendar = calendar;
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
   * A method to pause the tick when the window state changes.
   */
  windowTickState(windowState: WINDOW_STATE) {
    console.log(windowState);
    if (!this.#autoTick) return;
    switch (windowState) {
      case "FOCUS":
        this.tickState(DdmApi.Core.GameState.current);
        break;
      case "BLUR":
        if (this.#worker || this.#interval) this.stop();
        break;
    }
  }
  /**
   * A method to automatically start/stop ticks. It is called in the CoreManager when gameState is set.
   * @param {DdmGameState} gameState - the game state that the game is currently in.
   */
  tickState(gameState: GAME_STATE) {
    if (!this.#autoTick) return;
    if (gameState === GAME_STATE.MAP || gameState === GAME_STATE.CUSTOM)
      this.start();
    else this.stop();
  }
  /**
   * The method called to setup the save data for the save file.
   */
  onSave() {
    const saveData: DdmNodeSaveData = {
      nodeEvents: this.#tickEvents,
      nodeTracked: this.#trackedEvents,
    };
    saveData.nodeEvents.push({
      id: "storeTick",
      type: "custom",
      tick: this.#tick,
    });
    return saveData;
  }
  /**
   * The method called to load data from the save file.
   */
  onLoad(saveData: DdmNodeSaveData) {
    const { nodeEvents, nodeTracked } = saveData;

    const gameTick = nodeEvents.pop();
    if (gameTick) {
      const { tick } = gameTick;
      this.#tick = tick;
    } else {
      this.#tick = 0;
    }

    this.#setEventData(nodeEvents, nodeTracked);
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
  #setEventData(newEvents: DdmNodeEvent[], newTracked: DdmNodeEventTracked) {
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
