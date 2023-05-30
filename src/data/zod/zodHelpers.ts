import { string as zString } from "zod";
import type { ZodSchema } from "zod";
import type { DdmParserFuncs } from "../../types/ddmTypes";

/**
 * An async function to fetch data from a json file and parse it with a zod schema.
 * @param {string} path - the string path to the json file.
 * @param {ZodSchema} schema - the schema used to parse the json file that is read.
 * @returns { Promise<T> } - a Promise of type <T> given to the function.
 */
export const fetchJsonSchema = async <T>(path: string, schema: ZodSchema) => {
  const fetchJson = async () => {
    return await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  };

  let returnData;
  try {
    const dataReq = await fetchJson();
    const rawData = await dataReq.json();
    returnData = schema.parse(rawData);
  } catch (e) {
    console.log(`An error with '${path}'.`, e);
  }
  return returnData as Promise<T>;
};
/**
 * A function that uses z.string() and transforms on it to be able to parse a string
 * without having to use fetch to get json data.
 * @param {string} target - the string to be converted into an object.
 * @param {DdmParserFuncs} parserFuncs - the object containing the functions needed to
 * parse each key.
 * @param {boolean | undefined} isArray - a boolean that allows to parse the string as an
 * array of the same object. Example DdmNodeEvent[].
 * @returns { {[key:string]: unknown} | { [key: string]: unknown }[] }
 */
export const parseStructSchema = (
  target: string,
  parserFuncs: DdmParserFuncs,
  isArray?: boolean
): { [key: string]: unknown } | { [key: string]: unknown }[] => {
  return (
    zString()
      .transform((value) => JSON.parse(value))
      // Note: Add error handling.
      .transform((value) => {
        const parser = (targetValue: string) =>
          Object.fromEntries(
            Object.entries(targetValue).map(([key, value]) => {
              if (parserFuncs[key]) {
                return [key, parserFuncs[key](value)];
              }
              return [key, value];
            })
          );

        if (isArray) {
          return (value as []).map((entry) => {
            const newEntry = JSON.parse(entry);
            return parser(newEntry);
          });
        }

        return parser(value);
      })
      .parse(target)
  );
};
