import type { DdmNodeTypes } from "../types/ddmTypes";

export {};

onmessage = ({ data }: { data: DdmNodeTypes[] }) => {
  const eventTracked: { [key: string]: number } = {};

  const setTracked = (eventId: string, tick: number) => {
    eventTracked[eventId] = tick;
  };

  const eventsToFire: DdmNodeTypes[] = [];

  const newData = data.filter((eventData) => {
    const { tick, isTrackable } = eventData;
    const newTick = tick - 1;

    if (isTrackable) {
      setTracked(eventData.id, newTick);
    }
    if (newTick === 0) {
      eventsToFire.push(eventData);
    }

    if (tick > 1) {
      eventData.tick = newTick;
      return eventData;
    }
  });

  self.postMessage({
    eventsToFire,
    newEvents: newData,
    newTracked: eventTracked,
  });
};
