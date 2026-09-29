import type { DateValue } from "../../../Abstracts/DateValue/DateValue.types";

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
