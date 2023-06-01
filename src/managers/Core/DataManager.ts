import { DataStorageKeys, NodeTypeGuard, PluginKeys } from "../../enums/keys";
import {
  DdmTintColourParam,
  calendarSchema,
  tintColourSchema,
} from "../../data/zod/NodeIndex";
// Storage
import { TITLE } from "../../game";
import { set, get } from "idb-keyval";
import { strToU8, strFromU8, compressSync, decompressSync } from "fflate";
// Helpers
import { isEmpty } from "ramda";
import { parseStructSchema } from "../../data/zod/zodHelpers";
import {
  stringIsInEnum,
  convertToNumber,
  convertToBoolean,
} from "../../helpers/common";
// Types
import type { DdmNodeGuardType } from "../../enums/keys";
import type {
  DdmCalendar,
  DdmNodeEvent,
  DdmNodeSaveData,
  DdmParserFuncs,
  DdmPersistSaveData,
  DdmSaveData,
} from "../../types/ddmTypes";

// ===================================================
//                  HELPERS

/**
 * A collection of funcs needed to parse an incoming string into a DdmCalendar object.
 */
const CalendarParsers: DdmParserFuncs = {
  days: JSON.parse,
  months: JSON.parse,
  weeksInMonth: convertToNumber,
};
/**
 * A functions that parses a string into a DdmCalendar object.
 * @param {string} target - the target string to parse.
 * @returns {DdmCalendar | undefined} DdmCalendar if successful or undefined if it fails to parse.
 */
const parseCalendar = (target: string): DdmCalendar | undefined => {
  const newCalendar = calendarSchema.parse(
    parseStructSchema(target, CalendarParsers)
  );

  if (!newCalendar) return undefined;

  return {
    ...newCalendar,
    year: 0,
    totalMonths: newCalendar.months.length - 1,
    totalDays: newCalendar.days.length - 1,
  };
};
/**
 *
 */
const TintParsers = {
  red: convertToNumber,
  green: convertToNumber,
  blue: convertToNumber,
  greyScale: convertToNumber,
};
/**
 *
 * @param target
 * @returns {DdmTintColourParam | undefined}
 */
const parseTintColor = (target: string): DdmTintColourParam | undefined => {
  const newColour = tintColourSchema.parse(
    parseStructSchema(target, TintParsers)
  );

  if (!newColour) return undefined;

  return newColour;
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
  // ===================================================
  //                Data Convertion
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
   * @description Exposes the function to convert a string into a DdmCalendar to the global api.
   * @param {string} calendarStruct - the string to convert.
   * @returns {DdmCalendar | undefined} - a DdmCalendar Object if successful or undefined if not.
   */
  toCalendar(calendarStruct: string): DdmCalendar | undefined {
    if (!DdmApi.Core.NM) return;
    return parseCalendar(calendarStruct);
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
  toTint(tintStruct: string): DdmTintColourParam | undefined {
    if (!DdmApi.Core.NM) return;
    const data = parseTintColor(tintStruct);
    if (data) return data;
  }
  // ===================================================
  //                 Data Storage

  async onSave(saveID: number | string) {
    const saveName = `${TITLE}-File-${saveID}`;
    const saveData: { [key: string]: any } = {};

    PluginKeys.forEach((plugin) => {
      if (DdmApi[plugin] && "onSave" in DdmApi[plugin]) {
        Object.entries(DdmApi[plugin].onSave()).forEach(([key, obj]) => {
          saveData[key] = obj;
        });
      }
    });

    const jsonData = JSON.stringify(saveData);
    const buffer = strToU8(jsonData);
    const compressData = compressSync(buffer);
    await set(saveName, compressData);
  }

  async onLoad(saveID: number | string) {
    const saveName = `${TITLE}-File-${saveID}`;
    const str = await get(saveName);
    const decompressed = decompressSync(str);
    const restored = strFromU8(decompressed);
    const saveData = JSON.parse(restored) as DdmSaveData;

    PluginKeys.forEach((plugin) => {
      if (DdmApi[plugin] && "onLoad" in DdmApi[plugin]) {
        const pluginData: { [key: string]: any } = {};

        DataStorageKeys[plugin]?.forEach((key) => {
          pluginData[key] = saveData[key];
        });

        if (!isEmpty(pluginData)) {
          switch (plugin) {
            case "NM":
              DdmApi[plugin].onLoad(pluginData as DdmNodeSaveData);
              break;
            case "PM":
              DdmApi[plugin].onLoad(pluginData as DdmPersistSaveData);
              break;
          }
        }
      }
    });
  }
}

const DdmDataManager = new CoreDataManager();

// ===================================================
//                      EXPORT

export { DdmDataManager };
