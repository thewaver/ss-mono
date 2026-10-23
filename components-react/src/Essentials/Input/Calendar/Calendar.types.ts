import type { ReactNode } from "react";

import type {
    BaseCalendarPrecisionValues,
    BaseCalendarProps,
    CalendarMonthCountExcludesPrecision,
    CalendarRenderProps,
    DateValue,
    DateValueRange,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type CalendarDayRenderer = (day: DateValue, flags: InteractionFlags<CalendarRenderProps>) => ReactNode;

export type CalendarWeekdayRenderer = (name: string, index: number) => ReactNode;

export type CalendarWeekNumberRenderer = (weekNumber: number) => ReactNode;

export type CalendarMonthHeaderRenderer = (month: DateValue, index: number) => ReactNode;

export type CalendarDayProps = Omit<InteractionControlProps<CalendarRenderProps>, "ariaLabel"> & {
    /** Names the day for assistive technology, since the cell often shows only its number. Required here: a bare number is not a date. */
    ariaLabel: string;
    /** Runs when this day is picked. */
    onSelect: () => void;
};

export type CalendarBaseProps = BaseCalendarProps & {
    /** Which month is shown, and how to change it. It is the only thing that pages the calendar. */
    month: readonly [DateValue, (month: DateValue) => void];
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
        /** Which day is picked, and how to change it. It is the only thing that picks one. */
        value: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
    } & CalendarMonthCountExcludesPrecision;

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked, and how to change it. It is the only thing that picks one. */
    value: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
};
