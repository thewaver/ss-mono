import type { Snippet } from "svelte";

import type {
    BaseCalendarPrecisionValues,
    BaseCalendarProps,
    CalendarMonthCountExcludesPrecision,
    CalendarRenderProps,
    DateValue,
    DateValueRange,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type CalendarDayRenderer = Snippet<[day: DateValue, flags: InteractionFlags<CalendarRenderProps>]>;

export type CalendarWeekdayRenderer = Snippet<[name: string, index: number]>;

export type CalendarWeekNumberRenderer = Snippet<[weekNumber: number]>;

export type CalendarMonthHeaderRenderer = Snippet<[month: DateValue, index: number]>;

export type CalendarDayProps = Omit<InteractionControlProps<CalendarRenderProps>, "ariaLabel"> & {
    /** Names the day for assistive technology, since the cell often shows only its number. Required here: a bare number is not a date. */
    ariaLabel: string;
    /** Runs when this day is picked. */
    onSelect: () => void;
};

export type CalendarBaseProps = BaseCalendarProps & {
    /** Which month is shown. Bind it with `bind:month`; it is the only thing that pages the calendar. */
    month: DateValue;
    /** Draws one day cell. */
    renderDay: CalendarDayRenderer;
    /** Draws one weekday heading. */
    renderWeekday?: CalendarWeekdayRenderer;
    /**
     * Draws the number of one week, in a column before the days. The column is drawn only while this is given, and
     * only in the day view; `minDaysInFirstWeek` decides how the weeks are counted.
     */
    renderWeekNumber?: CalendarWeekNumberRenderer;
    /**
     * Draws the heading over one month while several are shown, handed that month's first day and its place among
     * them, so the first can carry a previous button and the last a next one.
     */
    renderMonthHeader?: CalendarMonthHeaderRenderer;
};

export type CalendarPrecisionProps = BaseCalendarPrecisionValues;

export type CalendarCompositeProps = CalendarBaseProps &
    CalendarPrecisionProps & {
        /** Whether a given day counts as picked, which is what separates picking one day from picking a range. */
        computeIsSelected: (day: DateValue) => boolean;
        /** The day a range is being measured from while one is being picked. */
        anchorDay?: DateValue;
        /**
         * The range that would result from ending it on a given day, which is what paints the stretch under the
         * pointer.
         */
        computeRange?: (highlighted: DateValue) => DateValueRange | undefined;
        /** Runs when a day is picked. */
        onPick: (day: DateValue) => void;
    };

export type CalendarProps = CalendarBaseProps &
    CalendarPrecisionProps & {
        /** Which day is picked. Bind it with `bind:value`; it is the only thing that picks one. */
        value: DateValue | undefined;
    } & CalendarMonthCountExcludesPrecision;

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked. Bind it with `bind:value`; it is the only thing that picks one. */
    value: DateValueRange | undefined;
};
