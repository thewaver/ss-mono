import type {
    DateValue,
    DateValueWeekStart,
    DateValueWeekdayWidth,
} from "../../../Abstracts/DateValue/DateValue.types";

export type CalendarPrecision = "day" | "month" | "year";

export type CalendarRenderProps = {
    /** The day this cell stands for — under a coarser precision, the first day of the month or year it holds. */
    day: DateValue;
    /** Whether this day is picked. */
    isSelected: boolean;
    /** Whether this day is today. */
    isToday: boolean;
    /**
     * Whether this day belongs to a neighboring month, shown to fill the grid out. Always `false` above `day`
     * precision.
     */
    isOutsideMonth: boolean;
    /** Whether the keyboard is currently on this day. */
    isHighlighted: boolean;
    /** Whether this day falls inside the picked range. */
    isInRange: boolean;
    /** Whether this day is the first of the picked range. */
    isRangeStart: boolean;
    /** Whether this day is the last of the picked range. */
    isRangeEnd: boolean;
};

export type CalendarKeyAction = {
    kind: "pick" | "move";
    day: DateValue;
};

export type BaseCalendarValues = {
    /** Names the calendar for assistive technology. */
    ariaLabel?: string;
    /** Which country's conventions the month and weekday names are written in. */
    locale?: string;
    /** Which day begins a week, which decides the order of the column headings. */
    weekStartsOn?: DateValueWeekStart;
    /** How long the weekday headings are written — a letter, three letters, or the whole word. */
    weekdayWidth?: DateValueWeekdayWidth;
    /** Which day counts as today, so a consumer can hold it still rather than letting it follow the clock. */
    today?: DateValue;
    /** The earliest day that can be picked. */
    minValue?: DateValue;
    /** The latest day that can be picked. */
    maxValue?: DateValue;
    /** Turns the calendar off, so no day can be picked and it cannot be paged. */
    isDisabled?: boolean;
    /** The space between day cells. */
    gap?: number;
};

export type BaseCalendarCbs = {
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

export type BaseCalendarProps = BaseCalendarValues & BaseCalendarCbs;

export type BaseCalendarPrecisionValues = {
    /**
     * What one cell of the grid holds, which is what a pick sets. `day` is a month of days under weekday headings;
     * `month` is the year's months three to a row, and a pick sets the first of that month; `year` is twelve years,
     * three to a row, and a pick sets the first day of that year. A pick is clamped into `minValue` and `maxValue`,
     * and a cell is pickable while any of its days is. `month` still says which page is shown, the page keys
     * step a whole page — a month, a year, twelve years — and Shift with them a year under `day` and twelve pages
     * above it. The weekday props are read only by `day`.
     */
    precision?: CalendarPrecision;
};
