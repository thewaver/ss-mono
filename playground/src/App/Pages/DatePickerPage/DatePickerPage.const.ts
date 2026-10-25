import { type ClockSteps, DateValueUtils } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

export const FIELD_WIDTH = 220;
export const PAIR_FIELD_WIDTH = 160;
export const LOCALE = "en-GB";

export const TODAY = DateValueUtils.fromIso("2026-08-10")!;
export const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
export const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
export const CAESAR = DateValueUtils.fromIso("-000043-03-15")!;

export const OPENING_TIME: TimeValue = { hour: 9, minute: 0 };
export const CLOSING_TIME: TimeValue = { hour: 17, minute: 30 };

export const BOOKING_STEPS: ClockSteps = { minute: 15 };

export const EXAMPLE_NAMES = {
    picked: "With a calendar",
    bounded: "Bounded",
    weekdays: "Weekdays only",
    monthPrecision: "Picking a month",
};

export const CALENDAR_FIELD_WIDTH = 180;

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const WEEK_STARTS_ON_MONDAY = 1;

export const WEEKEND_OFFSET = 5;

export const EXAMPLES_ROOT = "/src/App/Pages/DatePickerPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/DatePickerPage/Docs";
