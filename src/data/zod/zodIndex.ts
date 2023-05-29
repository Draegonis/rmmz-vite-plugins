import {
  array as zArr,
  string as zStr,
  number as zNum,
  tuple as zTup,
} from "zod";

export const zStringArray = zArr(zStr());
export const zNumberArray = zArr(zNum());
export const zArrayNumberNumber = zArr(zTup([zNum(), zNum()]));
