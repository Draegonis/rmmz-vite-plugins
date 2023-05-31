import type { LitteralUnion } from "../types/ddmTypes";

// ===================================================
//                     PARAM

export const PluginKeys = ["PM", "NM"] as const;
export type DdmPluginKeys = LitteralUnion<(typeof PluginKeys)[number]>;

export const CalenderKeys = ["months", "weeksInMonth", "days"] as const;
export type DdmCalenderKeys = LitteralUnion<(typeof CalenderKeys)[number]>;

// ===================================================
//                      API

export const ApiKeys = [...PluginKeys, "Core"] as const;
export type DdmApiKeys = LitteralUnion<(typeof ApiKeys)[number]>;

// ===================================================
//                     State

export enum GAMESTATE_SUB_KEYS {
  "NODETICK" = "NODETICK",
  "CUSTOM" = "CUSTOM",
}

export enum WEATHER_SUB_KEYS {
  "CUSTOM" = "CUSTOM",
}

export enum WINDOW_SUB_KEYS {
  NODETICK = "NODETICK",
}

// ===================================================
//                    STORAGE

export const PersistStoredKeys = [
  "custom",
  "stash",
  "switch",
  "var",
  "switch&var",
] as const;
export type DdmStoredPersistKeys = LitteralUnion<
  (typeof PersistStoredKeys)[number]
>;

export const NodeTypeGuard = [
  "mapEvent",
  "switch",
  "variable",
  "custom",
] as const;
export type DdmNodeGuardType = LitteralUnion<(typeof NodeTypeGuard)[number]>;

const NodeStorageKeys = ["nodeEvents", "nodeTracked"] as const;
type DdmNodeStorageKeys = LitteralUnion<(typeof NodeStorageKeys)[number]>;

const PersistStorageKeys = ["persistUUID"] as const;
type DdmPersistStorageKeys = LitteralUnion<(typeof PersistStorageKeys)[number]>;

export const DataStorageKeys = {
  NM: NodeStorageKeys,
  PM: PersistStorageKeys,
};
export type DdmDataStorageKeys = {
  NM: DdmNodeStorageKeys;
  PM: DdmPersistStorageKeys;
} & {
  [key: string]: readonly string[];
};
