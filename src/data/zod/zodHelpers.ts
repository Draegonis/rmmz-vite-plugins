import { string as zString } from "zod";
import type { ZodSchema } from "zod";

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

export const parseStructSchema = (
  target: string,
  parserFuncs: Record<string, (target: string) => any>,
  isArray?: boolean
) => {
  return zString()
    .transform((value) => JSON.parse(value))
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
    .parse(target);
};
