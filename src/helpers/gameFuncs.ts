// ===================================================
//                      HELPERS

import { WEATHER_STATE } from "../enums/state";

/**
 * @description A function to verify a number is in the Colour range.
 * @param {number} range - the number to verify. For colours the range is -255 - 255.
 * @param {boolean | undefined} greyScale - if the range is a grey scale value, which is 0-255.
 * @returns {number} - the range returned.
 */
export const verifyColourRange = (
  range: number,
  greysScale?: boolean
): number => {
  let lowerRange = greysScale ? 0 : -255;
  if (range < lowerRange) return lowerRange;
  if (range > 255) return 255;
  return range;
};
/**
 * @description A function used to verify if the id number
 * for $gameSwitches is valid and is initialized.
 * @param {number} id The id number of the game switch.
 * @returns {boolean} Returns true if passed verification.
 */
const verifyGameSwitch = (id: number): boolean => {
  return (
    $gameSwitches && $dataSystem && id > 0 && id < $dataSystem.switches.length
  );
};
/**
 * @description A function used to verify if the id number
 * for $gameVariables is valid and is initialized.
 * @param {number} id The id number of the game variable.
 * @returns {boolean} Returns true if passed verification.
 */
const verifyGameVariable = (id: number): boolean => {
  return (
    $gameSwitches && $dataSystem && id > 0 && id < $dataSystem.variables.length
  );
};
/**
 * @description A function to varify if the arguements for
 * $gameSelfSwitches are valid values and is initialized.
 * @param {number} mapId - the number id of the map.
 * @param {number} eventId - the number id of the event.
 * @param {string} switchId - the string id of the switch.
 * @returns {boolean} if all conditions are met it returns true.
 */
const verifySelfSwitch = (
  mapId: number,
  eventId: number,
  switchId: string
): boolean => {
  const swId = switchId.toUpperCase();
  return (
    $gameSelfSwitches &&
    mapId > 1 &&
    eventId > 1 &&
    $gameSelfSwitches.value([mapId, eventId, swId])
  );
};

// ===================================================
//                      UTILITY

/**
 * @description Object holder for methods that allow you to call
 * a callback on a set of ranges.
 */
export const setByRange = {
  /**
   * @description Method that uses a callback each iteration of a range.
   * @param {number} first - the first number of the range inclusive.
   * @param {number} last - the last number of the range inclusive.
   * @param {(num: number) => void} callback - the callback to be called
   * on each iteration of the range that takes a number arguement.
   */
  forEach(first: number, last: number, callback: (num: number) => void) {
    for (let num = first; num <= last; num++) {
      callback(num);
    }
  },
  /**
   * @description Method that wraps the $gameSelfSwitches.setValue but called
   * for a range of event id of the map.
   * @param {number} mapId - the number id of the map.
   * @param {string} switchId - the string value of the switch.
   * @param {number} first - the first number of the range inclusive.
   * @param {number} last - the last number of the range inclusive.
   * @param {boolean} newValue - the new value of all the self switches.
   */
  selfSwitch(
    mapId: number,
    switchId: string,
    first: number,
    last: number,
    newValue: boolean
  ) {
    const swId = switchId.toUpperCase();
    this.forEach(first, last, function (num: number) {
      if (verifySelfSwitch(mapId, num, switchId)) {
        $gameSelfSwitches.setValue([mapId, num, swId], newValue);
      }
    });
  },
  /**
   * @description Method that wraps the $gameSwitches.setValue for a range
   * ids to the same new value.
   * @param {number} first - the first number of the range inclusive.
   * @param {number} last - the last number of the range inclusive.
   * @param {boolean} newValue - the new boolean value for all the switches.
   */
  switch(first: number, last: number, newValue: boolean) {
    this.forEach(first, last, function (num: number) {
      if (verifyGameSwitch(num)) {
        $gameSwitches.setValue(num, newValue);
      }
    });
  },
  /**
   * @description Method that wraps the $gameVariables.setValue for a range
   * ids to the same new value.
   * @param {number} first - the first number of the range inclusive.
   * @param {number} last - the last number of the range inclusive.
   * @param {any} newValue - the new value to set to all the ids.
   */
  var(first: number, last: number, newValue: any) {
    this.forEach(first, last, function (num: number) {
      if (verifyGameVariable(num)) {
        $gameVariables.setValue(num, newValue);
      }
    });
  },
};
/**
 * @description Object holder for the function wrappers for $gameSwitches.setValue or $gameVariables.setValue.
 */
export const setGameVariables = {
  /**
   * @description A function wrapper for $gameSwitches.setValue.
   * @param {number} switchId - the switch id to set the value to.
   * @param {boolean} newValue - the new value for the switch.
   */
  switch: (switchId: number, newValue: boolean) => {
    if (verifyGameSwitch(switchId)) {
      $gameSwitches.setValue(switchId, newValue);
    }
  },
  var: (variableId: number, newValue: any | any[]) => {
    if (verifyGameVariable(variableId)) {
      $gameVariables.setValue(variableId, newValue);
    }
  },
};
/**
 * @description Object holder for the function wrappers for
 * $gameSwitches.value or $gameVariables.value.
 */
export const getGameVariables = {
  /**
   * A function wrapper on $gameSwitches.value.
   * @param {number} switchId - the switch id number to get the value of.
   * @returns {boolean | null} - a boolean or null if the value is not found.
   */
  switch: (switchId: number): boolean | null => {
    let switchBoolean = null;
    if (verifyGameSwitch(switchId)) {
      switchBoolean = $gameSwitches.value(switchId);
    }
    return switchBoolean;
  },
  /**
   * A function wrapper on $gameVariable.value.
   * @param {number} variableId - the id number of the variable to get
   * @returns {any | any[] | null} - the value of the gameVariable or null if not found.
   */
  var: (variableId: number): any | any[] | null => {
    let variableValue = null;
    if (verifyGameVariable(variableId)) {
      variableValue = $gameVariables.value(variableId);
    }
    return variableValue;
  },
};
/**
 * A function wrapper on $gameSelfSwitches.
 * @param {number} mapId - the id number of the map.
 * @param {number} eventId - the id number of the event on that map.
 * @param {number} switchId - the string id of the self switch.
 * @param {boolean} newValue - the new boolean value of the switch.
 */
export const setEventSelfSwitch = (
  mapId: number,
  eventId: number,
  switchId: string,
  newValue: boolean
) => {
  if (mapId > 0 && eventId > 0 && switchId !== "") {
    const swId = switchId.toUpperCase();
    if (verifySelfSwitch(mapId, eventId, switchId)) {
      $gameSelfSwitches.setValue([mapId, eventId, swId], newValue);
    }
  }
};
/**
 * A function wrapper on $gameScreen.changeWeather.
 * @param {WEATHER_STATE} type - the weather state to set to.
 * @param {number} power - the strength of the effect of weather.
 * @param {number} frames - the number of frames it takes for the weather to be in full effect.
 */
export const setWeatherState = (
  type: WEATHER_STATE,
  power: number,
  frames: number
) => {
  const FRAMES = frames > 0 ? frames : 1;
  const POWER = power > 9 ? 9 : power > 0 ? power : 1;
  if ($gameScreen)
    $gameScreen.changeWeather(type.toLocaleLowerCase(), POWER, FRAMES);
};
/**
 * @description A function wrapper on $gameScreen.startTint, also verifies the values.
 * @param {number} red - the red number value of the colour.
 * @param {number} green - the green number value of the colour.
 * @param {number} blue - the blue number value of the colour.
 * @param {number} greysScale - the grey scale value of the colour.
 * @param {number} frames - the number of frames till the tint is in full effect.
 */
export const setScreenTint = (
  red: number,
  green: number,
  blue: number,
  greysScale: number,
  frames: number
) => {
  if (!$gameScreen) return;
  $gameScreen.startTint(
    [
      verifyColourRange(red),
      verifyColourRange(green),
      verifyColourRange(blue),
      verifyColourRange(greysScale, true),
    ],
    frames > 0 ? frames : 1
  );
};
/**
 * @description A function wrapper on $gameTemp.reserveCommonEvent.
 * @param {number} id - the id of the common event to run.
 */
export const reserveCommonEvent = (id: number) => {
  if (id > 0) $gameTemp.reserveCommonEvent(id);
};
