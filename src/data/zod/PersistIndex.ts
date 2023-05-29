import { z } from "zod";
import { zNumberArray, zArrayNumberNumber, zStringArray } from "./zodIndex";

// ===================================================
//                   SCHEMA

const persistIndexSchema = z.object({
  stash: zArrayNumberNumber,
  switch: zNumberArray,
  var: zNumberArray,
  custom: zStringArray,
});

type DdmPersistIndexSchema = z.infer<typeof persistIndexSchema>;

// ===================================================
//                      EXPORT

export { persistIndexSchema };
export type { DdmPersistIndexSchema };
