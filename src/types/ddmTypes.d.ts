import type {
  DdmApiKeys,
  DdmStoredKeys,
  DdmPluginKeys,
  DdmNodeGuardType,
} from "../enums/keys";
import type { DdmCalenderParam } from "../data/zod/NodeIndex";
import type { DdmTintState } from "../enums/state";

// ===================================================
//                  CORE

export type DdmPluginsEnabled = DdmEnforceKeysOfSameType<
  DdmPluginKeys,
  boolean
>;

// ===================================================
//                  PERSIST

export type DdmPersistState = {
  isInit: boolean;
  currentId: string;
  stored: {
    stash: Map<number, number>;
    switch: Map<number, boolean | null>;
    var: Map<number, any | null>;
    custom: Map<string, any | null>;
  };
} & {
  [key: string]: any;
};

export type DdmPersistActions = {
  initStore: (refresh: boolean) => Promise<void>;
  fetchEntireStore: (storeId: string) => {
    custom: Map<string, any>;
    stash: Map<number, number>;
  };
  fetchCustomOnly: () => Map<string, any>;
  updateStore: () => string;
  updateSingle: (key: DdmStoredKeys) => void;
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
    eventsToFire: DdmNodeEvent[] | undefined;
    newEvents: DdmNodeEvent[];
    newTracked: Record<string, number>;
  };
};

export interface DdmNodeBaseEvent {
  type: DdmNodeGuardType;
  id: string;
  tick: number;
  isTrackable?: boolean;
}

export interface DdmNodeMapEvent extends DdmNodeBaseEvent {
  type: "mapEvent" extends DdmNodeGuardType ? "mapEvent" : never;
  eventMap: number;
  eventId: number;
}

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

// Calender

export interface DdmCalender extends DdmCalenderParam {
  year: number;
  totalMonths: number;
  totalDays: number;
}

// Tint Colours

export type DdmTintColours = DdmEnforceKeysOfSameType<
  DdmTintState,
  [number, number, number, number]
> & {
  custom: { [key: string]: [number, number, number, number] };
};

// ===================================================
//                  INIT API

export type DdmInitApi = DdmEnforceKeysOfSameType<
  DdmApiKeys,
  (params: DdmAllParams) => void
>;

// ===================================================
//                   PARAMS

export interface DdmCoreParams {
  type: "Core";
  PM: string; // boolean
  NM: string; // boolean
}

export interface DdmPersistParams {
  type: "PM";
  refresh: string; // boolean
}

export interface DdmNodeParams {
  type: "NM";
  calender: string; // DdmCalender
  secondsPerTick: string; // number
}

export type DdmAllParams = DdmCoreParams | DdmNodeParams | DdmPersistParams;

// ===================================================
//                    UTILITY

export type LitteralUnion<T extends U, U = string> = T;

export type DdmEnforceKeysOfSameType<Key, Type> = {
  [Property in Key]: Type;
};
