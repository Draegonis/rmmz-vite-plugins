import type {
  DdmApiKeys,
  DdmStoredPersistKeys,
  DdmPluginKeys,
  DdmNodeGuardType,
  DdmNodeEventTypeGuard,
} from "../enums/keys";
import type { DdmCalendarParam } from "../data/zod/NodeIndex";
import type { TINT_STATE, WEATHER_STATE } from "../enums/state";

// ===================================================
//                  CORE

export type DdmPluginsEnabled = DdmEnforceKeysOfSameType<
  DdmPluginKeys,
  boolean
>;

// ===================================================
//                  PERSIST

export type DdmPersistSaveData = {
  persistUUID: string;
};

export type DdmPersistState = {
  isInit: boolean;
  currentId: string;
  stored?: {
    stash?: Map<number, number>;
    switch?: Map<number, boolean | null>;
    var?: Map<number, any | null>;
    custom?: Map<string, any | null>;
  } & {
    [key: string]: any;
  };
} & {
  [key: string]: any;
};

export type DdmPersistActions = {
  initStore: (refresh: boolean) => Promise<void>;
  fetchEntireStore: (storeId: string) => {
    custom: Map<string, any> | undefined;
    stash: Map<number, number> | undefined;
  };
  fetchCustomOnly: () => Map<string, any> | undefined;
  updateStore: () => string;
  updateSingle: (key: DdmStoredPersistKeys) => void;
};

export type DdmAllPersistStore = DdmPersistState &
  DdmPersistActions & {
    [key: string]: unknown;
  };

// ===================================================
//                   NODE

export type DdmNodeEventTracked = { [key: string]: number };

export type DdmNodeWorkerMessage = { data: DdmNodeEvent[] };

export type DdmNodeWorkerReturn = {
  data: {
    eventsToFire: DdmNodeEvent[];
    newEvents: DdmNodeEvent[];
    newTracked: Record<string, number>;
  };
};

export type DdmNodeSaveData = {
  nodeEvents: DdmNodeEvent[];
  nodeTracked: DdmNodeEventTracked;
};

export interface DdmNodeBaseEvent {
  type: DdmNodeGuardType;
  id: string;
  tick: number;
  isTrackable?: boolean;
}

export interface DdmNodeMapEvent extends DdmNodeBaseEvent {
  type: "mapEvent" extends DdmNodeGuardType ? "mapEvent" : never;
  data: {
    type: DdmNodeEventTypeGuard;
  } & DdmAllMapEvents;
}

export interface DdmSelfSwitchEvent {
  type: "selfSwitch" extends DdmNodeEventTypeGuard ? "selfSwitch" : never;
  selfSW: [number, number, string, boolean];
}

export interface DdmTintEvent {
  type: "tint" extends DdmNodeEventTypeGuard ? "tint" : never;
  tint: TINT_STATE;
  frames: number;
}

export interface DdmWeatherEvent {
  type: "weather" extends DdmNodeEventTypeGuard ? "weather" : never;
  weatherType: WEATHER_STATE;
  power: number;
  frames: number;
}

export type DdmAllMapEvents =
  | DdmSelfSwitchEvent
  | DdmTintEvent
  | DdmWeatherEvent;

export interface DdmNodeSwitchEvent extends DdmNodeBaseEvent {
  type: "switch" extends DdmNodeGuardType ? "switch" : never;
  switchId: number;
  newValue: boolean;
}

export interface DdmNodeVarEvent extends DdmNodeBaseEvent {
  type: "variable" extends DdmNodeGuardType ? "variable" : never;
  variableId: number;
  newValue: any;
}

export interface DdmNodeCustomEvent extends DdmNodeBaseEvent {
  type: "custom" extends DdmNodeGuardType ? "custom" : never;
}

export type DdmNodeEvent =
  | DdmNodeMapEvent
  | DdmNodeSwitchEvent
  | DdmNodeVarEvent
  | DdmNodeCustomEvent;

// ===================================================
//                    DATA

export type DdmSaveData = DdmNodeSaveData & DdmPersistSaveData;

// Helper
export type DdmParserFuncs = Record<string, (target: string) => unknown>;

// Calendar
export interface DdmCalendar extends DdmCalendarParam {
  year: number;
  totalMonths: number;
  totalDays: number;
}

// Tint Colours
export type DdmDayTints = DdmEnforceKeysOfSameType<
  TINT_STATE,
  [number, number, number, number]
>;

// ===================================================
//                  INIT API

export type DdmInitApi = DdmEnforceKeysOfSameType<
  DdmApiKeys,
  (params: DdmAllParams) => void
>;

// ===================================================
//                   PARAMS

export type DdmCoreParams = {
  type: "Core";
  PM: string; // boolean
  NM: string; // boolean
} & {
  [key: string]: any;
};

export type DdmPersistParams = {
  type: "PM";
  refresh: string; // boolean
} & {
  [key: string]: any;
};

export type DdmNodeParams = {
  type: "NM";
  secondsPerTick: string; // number
  calendar: string; // Ddmcalendar
  dawn: string; //  start TintColours
  normal: string; //
  dusk: string; //
  cloudy: string; //
  night: string; //  end TintColours
} & {
  [key: string]: any;
};

export type DdmAllParams = DdmCoreParams | DdmNodeParams | DdmPersistParams;

// ===================================================
//                    UTILITY

export type LitteralUnion<T extends U, U = string> = T;

export type DdmEnforceKeysOfSameType<Key, Type> = {
  [Property in Key]: Type;
};
