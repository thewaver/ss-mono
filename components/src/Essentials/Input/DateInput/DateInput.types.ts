import type { DateValue, DateValueCalendarId, DateValueEra } from "../../../Abstracts/DateValue/DateValue.types";
import type { CalendarDayMatcher } from "../Calendar/Calendar.types";

export type DateInputFormat = "iso" | "day_month_year" | "month_day_year";

export type DateInputPart = "year" | "month" | "day";

export type DateInputEra = {
    getValue: () => string;
    getOptions: () => DateValueEra[];
    set: (next: string) => void;
};

export type BaseDateInputValues = {
    /** The earliest date that can be entered. */
    minValue?: DateValue;
    /** The latest date that can be entered. */
    maxValue?: DateValue;
    /** The order and separators the date is written in. */
    format?: DateInputFormat;
    /** Which calendar system the date is read and written in. */
    calendar?: DateValueCalendarId;
    /** Which country's conventions decide the default format and names. */
    locale?: string;
    /**
     * The letters that stand for each part of the date in the format hint handed to `renderPlaceholder`. The
     * field puts them in the order the format writes the parts and joins them with its separator.
     */
    partHints: Record<DateInputPart, string>;
    /**
     * Days that cannot be entered, described the way the calendar's own `disabledDays` are: a date, a range
     * `{ from, to }` with both ends included, everything `{ before }` or `{ after }` a date, or the `{ daysOfWeek }`
     * given as numbers from `0`, Sunday, to `6`, Saturday. A typed day matching any of them is kept as typed and
     * marked as an error, and the value stays where it was. A picker hands the same list to its calendar, so the
     * field and the calendar refuse the same days.
     */
    disabledDays?: CalendarDayMatcher[];
};

export type BaseDateInputCbs = {
    /**
     * Whether one day can be entered, for rules neither a plain earliest and latest nor `disabledDays` can express.
     * A typed day it refuses is kept as typed and marked as an error, and the value stays where it was. It is asked
     * each time a whole date has been typed, and a picker hands it to its calendar too.
     */
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

export type BaseDateInputProps = BaseDateInputValues & BaseDateInputCbs;
