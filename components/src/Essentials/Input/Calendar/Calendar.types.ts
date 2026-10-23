import type {
    DateValue,
    DateValueMinDaysInFirstWeek,
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

export type CalendarDayMatcher =
    | DateValue
    | { from: DateValue; to: DateValue }
    | { before: DateValue }
    | { after: DateValue }
    | { daysOfWeek: number[] };

export type BaseCalendarValues = {
    /** Names the calendar for assistive technology. */
    ariaLabel?: string;
    /** Which country's conventions the month and weekday names are written in. */
    locale?: string;
    /** Which day begins a week, which decides the order of the column headings. */
    weekStartsOn?: DateValueWeekStart;
    /**
     * How many days of the new year the first week of the year must hold, which decides the week numbers. `4` with
     * weeks starting on Monday is ISO 8601, which most of Europe uses; `1` with weeks starting on Sunday is the
     * United States', where the week holding the first of January is week one. Read only while week numbers are
     * drawn.
     */
    minDaysInFirstWeek?: DateValueMinDaysInFirstWeek;
    /**
     * How many months are shown side by side, the first being `month`. The arrow keys walk from one month into the
     * next, the page keys step all of them at once, and a walk past the last month shown brings the next ones into
     * view. A day belonging to a neighboring month is left blank, since the month beside it already shows it. Only
     * the day view shows several months, so it is refused alongside `precision`.
     */
    monthCount?: number;
    /** The space between months while several are shown. */
    monthGap?: number;
    /** How long the weekday headings are written — a letter, three letters, or the whole word. */
    weekdayWidth?: DateValueWeekdayWidth;
    /** Which day counts as today, so a consumer can hold it still rather than letting it follow the clock. */
    today?: DateValue;
    /** The earliest day that can be picked. */
    minValue?: DateValue;
    /** The latest day that can be picked. */
    maxValue?: DateValue;
    /**
     * Days that cannot be picked, described rather than computed: a date, a range `{ from, to }` with both ends
     * included, everything `{ before }` or `{ after }` a date, or the `{ daysOfWeek }` given as numbers from `0`,
     * Sunday, to `6`, Saturday. A day matching any of them is disabled. These never call anything, so they cost the
     * same however the page is drawn; `computeIsDayDisabled` is for a rule they cannot describe, and both apply.
     */
    disabledDays?: CalendarDayMatcher[];
    /** Turns the calendar off, so no day can be picked and it cannot be paged. */
    isDisabled?: boolean;
    /** The space between day cells. */
    gap?: number;
};

export type BaseCalendarCbs = {
    /**
     * Whether one day can be picked, for rules neither a plain earliest and latest nor `disabledDays` can express.
     * It is asked once for every cell on the page, so a slow rule is slow once per cell.
     */
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

export type CalendarMonthCountExcludesPrecision = { precision?: undefined } | { monthCount?: undefined };
