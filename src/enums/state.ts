import type { LitteralUnion } from "../types/ddmTypes";

// ===================================================
//                  CORE STATE

export const GameState = [
  "empty",
  "title",
  "map",
  "battle",
  "menu",
  "shop",
  "custom",
] as const;
export type DdmGameState = LitteralUnion<(typeof GameState)[number]>;

export const WeatherState = ["none", "rain", "storm", "snow"] as const;
export type DdmWeatherState = LitteralUnion<(typeof WeatherState)[number]>;

export const TintState = ["normal", "dawn", "dusk", "cloudy", "night"] as const;
export type DdmTintState = LitteralUnion<(typeof TintState)[number]>;
