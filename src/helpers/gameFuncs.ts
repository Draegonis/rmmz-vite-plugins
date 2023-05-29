/* =================================================== 
                        HELPERS
   =================================================== */

/**
 * @description A function used to verify if the id number is in the game switches array.
 * @param {number} id The id number of the game switch.
 * @returns {boolean} Returns true if passed verification.
 */
const verifyGameSwitch = (id: number): boolean => {
  return (
    $gameSwitches && $dataSystem && id > 0 && id < $dataSystem.switches.length
  );
};

/**
 * @description A function used to verify if the id number is in the game variables array.
 * @param {number} id The id number of the game variable.
 * @returns {boolean} Returns true if passed verification.
 */
const verifyGameVariable = (id: number): boolean => {
  return (
    $gameSwitches && $dataSystem && id > 0 && id < $dataSystem.variables.length
  );
};

/* =================================================== 
                        UTILITY
   =================================================== */

/**
 * @description The functions to set data into either $gameSwitches or $gameVariables.
 * @property {(switchId: number, newValue: boolean) => void} switch - a function to set a boolean in $gameSwitches.
 * @property {(variableId: number, newValue: any | any[]) => void} var - a function to set a single value or array of values in $gameVariables.
 */
const setGameVariables = {
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
 * @description The functions to get data from either $gameSwitches or $gameVariables.
 * @property {(switchId: number) => boolean | undefined} switch - a function to get a value from $gameSwitches, returns undefined if it fails.
 * @property {(variableId: number) => any | any[] | undefined} var - a function to get a value(s) from $gameVariables, returns undefined if it fails.
 */
const getGameVariables = {
  switch: (switchId: number): boolean | null => {
    let switchBoolean = null;
    if (verifyGameSwitch(switchId)) {
      switchBoolean = $gameSwitches.value(switchId);
    }
    return switchBoolean;
  },
  var: (variableId: number): any | any[] | null => {
    let variableValue = null;
    if (verifyGameVariable(variableId)) {
      variableValue = $gameVariables.value(variableId);
    }
    return variableValue;
  },
};

/* 
      $gameScreen.startTint([red, green, blue, grey], frames);
      $gameScreen.changeWeather(type, power, frames);
      "for (var n = id1; n <= id2; n++) {
        operation
      }"
      $gameTemp.reserveCommonEvent(id);
    */

export const setEventSelfSwitch = (
  mapId: number,
  eventId: number,
  switchId: string,
  newValue: boolean
) => {
  if (mapId > 0 && eventId > 0 && switchId !== "") {
    const swId = switchId.toUpperCase();
    $gameSelfSwitches.setValue([mapId, eventId, swId], newValue);
  }
};

/* =================================================== 
                        EXPORT
   =================================================== */

export { setGameVariables, getGameVariables };
