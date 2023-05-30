import { NodeTypeGuard } from "../../enums/keys";
import { calenderSchema } from "../../data/zod/NodeIndex";
// Helpers
import { parseStructSchema } from "../../data/zod/zodHelpers";
import {
  stringIsInEnum,
  convertToNumber,
  convertToBoolean,
} from "../../helpers/common";
// Types
import type { DdmNodeGuardType } from "../../enums/keys";
import type { DdmCalender, DdmNodeEvent } from "../../types/ddmTypes";

// ===================================================
//                  HELPERS

const CalenderParsers: Record<string, (target: string) => unknown> = {
  days: JSON.parse,
  months: JSON.parse,
  weeksInMonth: convertToNumber,
};

const parseCalender = (target: string): DdmCalender | undefined => {
  const newCalender = calenderSchema.parse(
    parseStructSchema(target, CalenderParsers)
  );

  if (!newCalender) return undefined;

  return {
    ...newCalender,
    year: 0,
    totalMonths: newCalender.months.length - 1,
    totalDays: newCalender.days.length - 1,
  };
};

const NodeEventParsers: Record<string, (target: string) => unknown> = {
  tick: convertToNumber,
  isTrackable: convertToBoolean,
  eventId: convertToNumber,
  eventMap: convertToNumber,
  switchId: convertToNumber,
  valriableId: convertToNumber,
  newvalue: convertToNumber,
};

const parseNodeEvent = (
  target: string,
  type: DdmNodeGuardType
): DdmNodeEvent | undefined => {
  if (stringIsInEnum(type, NodeTypeGuard)) {
    return parseStructSchema(target, NodeEventParsers) as DdmNodeEvent;
  }
  return undefined;
};

// ===================================================
//                  MANAGER

/**
 * @classdesc A class that holds methods to parse data, mostly from
 * the PluginManager parameters objects or args from registerCommand
 * with some special cases.
 */
class CoreDataManager {
  /**
   * @description A method to convert a string value to a number.
   * @param {string} value The string value to convert to a number.
   * @returns {number} Returns the converted string value or 0 if it fails.
   */
  toNumber(value: string): number {
    return convertToNumber(value);
  }

  /**
   * @description A method to convert a string value to a boolean.
   * @param {string} value The string value to convert to a boolean.
   * @returns {boolean} Returns a boolean.
   */
  toBoolean(value: string): boolean {
    return convertToBoolean(value);
  }

  /**
   * @description A method to check if a string is in an enum const string array.
   * @param {string} target The string to check if it is in the enum.
   * @param {readonly string[]} enumToCheck The enum const string array to be checked against.
   * @returns {boolean} If target is a string in the enumToCheck returns true else false.
   */
  stringIsInEnum(target: string, enumToCheck: readonly string[]): boolean {
    return stringIsInEnum(target, enumToCheck);
  }

  toCalender(calenderStruct: string): DdmCalender | undefined {
    if (!DdmApi.Core.NM) return;
    return parseCalender(calenderStruct);
  }

  toNodeEvent(nodeStruct: string, type: DdmNodeGuardType) {
    if (!DdmApi.Core.NM) return;
    const data = parseNodeEvent(nodeStruct, type);
    if (data) {
      DdmApi.NM.scheduleEvent(data as DdmNodeEvent);
    }
  }
}

const DdmDataManager = new CoreDataManager();

// ===================================================
//                      EXPORT

export { DdmDataManager };
