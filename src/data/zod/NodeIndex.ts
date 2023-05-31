import { number as zNum, object as zObj, infer as zInfer } from "zod";
import { zStringArray } from "./zodIndex";

/**
 * The zod schema to parse a calendar from rmmz params.
 */
export const calendarSchema = zObj({
  months: zStringArray,
  weeksInMonth: zNum(),
  days: zStringArray,
});
export type DdmCalendarParam = zInfer<typeof calendarSchema>;
