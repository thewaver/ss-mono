import { DateValueUtils } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    default: "Default",
    bounded: "Bounded",
    twoMonths: "Two months",
    rightToLeft: "In a right-to-left box",
};

export const CALENDAR_IDS = DateValueUtils.getCalendarIds();

export const CALENDAR_FIELD_WIDTH = 180;

export const EXAMPLES_ROOT = "/src/App/Pages/RangeCalendarPage/Examples";

export const MONTH_HEADER_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
