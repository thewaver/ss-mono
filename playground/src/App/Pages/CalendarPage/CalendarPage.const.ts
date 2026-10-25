import { type DateValueCalendarId, DateValueUtils, type DateValueWeekStart } from "@thewaver/ss-components";

import { CalendarKnobs } from "../../Knobs/Calendars.const";

export const LOCALE = "en-GB";
export const WEEKEND_DAYS = [0, 6];

export const TODAY = DateValueUtils.fromIso("2026-08-10")!;
export const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
export const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
export const MIN_YEAR = DateValueUtils.fromIso("2019-01-01")!;
export const MAX_YEAR = DateValueUtils.fromIso("2031-12-31")!;

export const WEEK_START_LABELS: Record<DateValueWeekStart, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

export const EXAMPLE_NAMES = {
    default: "Default",
    bounded: "Bounded",
    weekdays: "Weekdays only",
    weekNumbers: "Week numbers",
    rightToLeft: "In a right-to-left box",
    monthPicker: "Month picker",
    yearPicker: "Year picker",
};

export const CALENDAR_FIELD_WIDTH = 180;

export const EXAMPLES_ROOT = "/src/App/Pages/CalendarPage/Examples";

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const WEEK_STARTS: DateValueWeekStart[] = [...CalendarKnobs.WEEK_STARTS];

export const DOCS_ROOT = "/src/App/Pages/CalendarPage/Docs";

export const OTHER_CALENDAR: DateValueCalendarId = "hebrew";
