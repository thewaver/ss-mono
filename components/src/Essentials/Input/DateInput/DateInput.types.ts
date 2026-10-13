import type { DateValue, DateValueCalendarId, DateValueEra } from "../../../Abstracts/DateValue/DateValue.types";

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
};

export type BaseDateInputProps = BaseDateInputValues;
