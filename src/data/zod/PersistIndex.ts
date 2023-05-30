import { z } from "zod";
import { zNumberArray, zArrayNumberNumber, zStringArray } from "./zodIndex";

// ===================================================
//                   SCHEMA

export const persistIndexSchema = z.object({
  stash: zArrayNumberNumber,
  switch: zNumberArray,
  var: zNumberArray,
  custom: zStringArray,
});
export type DdmPersistIndexSchema = z.infer<typeof persistIndexSchema>;
