import { object as zObj, infer as zInfer } from "zod";
import { zNumberArray, zArrayNumberNumber, zStringArray } from "./zodIndex";

// ===================================================
//                   SCHEMA

/**
 * The zod schema used to parse DdmDraegonisPersist.json.
 */
export const persistIndexSchema = zObj({
  stash: zArrayNumberNumber.optional(),
  switch: zNumberArray.optional(),
  var: zNumberArray.optional(),
  custom: zStringArray.optional(),
}).optional();
export type DdmPersistIndexSchema = zInfer<typeof persistIndexSchema>;
