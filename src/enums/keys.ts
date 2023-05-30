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
//                    STORAGE

export const StoredKeys = [
  "custom",
  "stash",
  "switch",
  "var",
  "switch&var",
] as const;
export type DdmStoredKeys = LitteralUnion<(typeof StoredKeys)[number]>;

export const NodeTypeGuard = [
  "mapEvent",
  "switch",
  "variable",
  "custom",
] as const;
export type DdmNodeGuardType = LitteralUnion<(typeof NodeTypeGuard)[number]>;
