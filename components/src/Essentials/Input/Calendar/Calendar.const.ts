import type { DateValueWeekStart, DateValueWeekdayWidth } from "../../../Abstracts/DateValue/DateValue.types";
import type { CalendarPrecision } from "./Calendar.types";

export const CALENDAR_DEFAULTS = {
    precision: "day" as CalendarPrecision,
    weekStartsOn: 1 as DateValueWeekStart,
    weekdayWidth: "short" as DateValueWeekdayWidth,
    gap: 0,
};
