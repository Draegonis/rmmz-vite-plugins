import { number as zNum, object as zObj, infer as zInfer } from "zod";
import { zStringArray } from "./zodIndex";

/**
 * The zod schema to parse a calender from rmmz params.
 */
export const calenderSchema = zObj({
  months: zStringArray,
  weeksInMonth: zNum(),
  days: zStringArray,
});
export type DdmCalenderParam = zInfer<typeof calenderSchema>;
