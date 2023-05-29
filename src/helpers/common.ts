export const convertToNumber = (value: string): number => {
  return Number(value || 0);
};

export const converttoBoolean = (value: string): boolean => {
  return value === "true";
};

export const stringIsInEnum = (
  target: string,
  enumToCheck: readonly string[]
): boolean => {
  return enumToCheck.includes(target);
};
