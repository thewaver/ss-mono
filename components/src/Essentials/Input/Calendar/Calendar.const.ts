import type {
    DateValueMinDaysInFirstWeek,
    DateValueWeekStart,
    DateValueWeekdayWidth,
} from "../../../Abstracts/DateValue/DateValue.types";
import type { CalendarPrecision } from "./Calendar.types";

export const CALENDAR_PRECISIONS: readonly CalendarPrecision[] = ["day", "month", "year"];

export const CALENDAR_DEFAULTS = {
    precision: "day" as CalendarPrecision,
    weekStartsOn: 1 as DateValueWeekStart,
    minDaysInFirstWeek: 4 as DateValueMinDaysInFirstWeek,
    monthCount: 1,
    monthGap: 16,
    weekdayWidth: "short" as DateValueWeekdayWidth,
    gap: 0,
};
