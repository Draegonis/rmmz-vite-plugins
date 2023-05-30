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
import type {
  DdmCalender,
  DdmNodeEvent,
  DdmParserFuncs,
} from "../../types/ddmTypes";

// ===================================================
//                  HELPERS

/**
 * A collection of funcs needed to parse an incoming string into a DdmCalender object.
 */
const CalenderParsers: DdmParserFuncs = {
  days: JSON.parse,
  months: JSON.parse,
  weeksInMonth: convertToNumber,
};
/**
 * A functions that parses a string into a DdmCalender object.
 * @param {string} target - the target string to parse.
 * @returns {DdmCalender | undefined} DdmCalender if successful or undefined if it fails to parse.
 */
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
/**
 * A collection of functions needed to parse a string into DdmNodeEvent object.
 */
const NodeEventParsers: DdmParserFuncs = {
  tick: convertToNumber,
  isTrackable: convertToBoolean,
  eventId: convertToNumber,
  eventMap: convertToNumber,
  switchId: convertToNumber,
  valriableId: convertToNumber,
  newvalue: convertToNumber,
};
/**
 * The function to parse an incoming string into a DdmNodeEvent
 * @param {string} target - the string to parse.
 * @param {DdmNodeGuardType} type - a type guard string to be checked.
 * @returns {DdmNodeEvent | undefined} - a DdmNodeEvent if successful or undefined if not.
 */
const parseNodeEvent = (
  target: string,
  type: DdmNodeGuardType
): DdmNodeEvent | undefined => {
  if (stringIsInEnum(type, NodeTypeGuard)) {
    return parseStructSchema(
      target,
      NodeEventParsers
    ) as unknown as DdmNodeEvent;
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
   * @description Exposes the convertToNumber to the global api.
   * @param {string} value The string value to convert to a number.
   * @returns {number} Returns the converted string value or 0 if it fails.
   */
  toNumber(value: string): number {
    return convertToNumber(value);
  }
  /**
   * @description Exposes the convertToBoolean to the global api.
   * @param {string} value The string value to convert to a boolean.
   * @returns {boolean} Returns a boolean.
   */
  toBoolean(value: string): boolean {
    return convertToBoolean(value);
  }
  /**
   * @description Exposes the stringIsInEnum to the global api.
   * @param {string} target The string to check if it is in the enum.
   * @param {readonly string[]} enumToCheck The enum const string array to be checked against.
   * @returns {boolean} If target is a string in the enumToCheck returns true else false.
   */
  stringIsInEnum(target: string, enumToCheck: readonly string[]): boolean {
    return stringIsInEnum(target, enumToCheck);
  }
  /**
   * @description Exposes the function to convert a string into a DdmCalender to the global api.
   * @param {string} calenderStruct - the string to convert.
   * @returns {DdmCalender | undefined} - a DdmCalender Object if successful or undefined if not.
   */
  toCalender(calenderStruct: string): DdmCalender | undefined {
    if (!DdmApi.Core.NM) return;
    return parseCalender(calenderStruct);
  }
  /**
   * @description Exposes the function to convert a string into a DdmNodeEvent and calls the method on
   * the NodeManager to schedule the event if it is not undefined.
   * @param {string} nodeStruct - the string to convert into a DdmNodeEvent.
   * @param {DdmNodeGuardType} type - the type string to guard against.
   */
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
