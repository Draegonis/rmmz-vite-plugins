import type { DdmCalendar, DdmTintColours } from "../../types/ddmTypes";

export const CALENDAR: Readonly<DdmCalendar> = {
  year: 0,
  weeksInMonth: 4,
  totalMonths: 12,
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  days: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  totalDays: 7,
};

export const TINT_COLOURS: Readonly<DdmTintColours> = {
  DAWN: [0, 0, 0, 0],
  NORMAL: [0, 0, 0, 0],
  CLOUDY: [0, 0, 0, 0],
  DUSK: [0, 0, 0, 0],
  NIGHT: [0, 0, 0, 0],
};
