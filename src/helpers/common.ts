export const convertToNumber = (value: string): number => {
  return Number(value || 0);
};
export const convertToBoolean = (value: string): boolean => {
  const TEST = value.toLowerCase();
  return TEST === "true";
};

export const stringIsInEnum = (
  target: string,
  enumToCheck: readonly string[]
): boolean => {
  return enumToCheck.includes(target);
};
