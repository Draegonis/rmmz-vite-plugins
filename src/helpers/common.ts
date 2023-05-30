/**
 * @description A function to convert a string to a int number.
 * @param {string} value - the string to be converted to a number.
 * @returns {number} - the number value of the string or 0 if fails.
 */
export const convertToNumber = (value: string): number => {
  return Number(value || 0);
};
/**
 * @description A function to convert
 * @param {string} value - the string value to be converted into a boolean.
 * @returns {boolean} - the boolean value of the string.
 */
export const convertToBoolean = (value: string): boolean => {
  const TEST = value.toLowerCase();
  return TEST === "true";
};
/**
 * @description A function that checks a string value against a
 * readonly string array.
 * @param {string} target - the string to be checked.
 * @param {readonly string[]} enumToCheck - the enum as cont string array to
 * to check if it includes the string.
 * @returns {boolean} - returns true if the target is in the enum.
 */
export const stringIsInEnum = (
  target: string,
  enumToCheck: readonly string[]
): boolean => {
  return enumToCheck.includes(target);
};
