import type { VNodeChild } from "vue";

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

export type CalendarDayRenderer = (props: {
    day: DateValue;
    flags: InteractionFlags<CalendarRenderProps>;
}) => VNodeChild;

export type CalendarWeekdayRenderer = (props: { name: string; index: number }) => VNodeChild;

export type CalendarWeekNumberRenderer = (props: { weekNumber: number }) => VNodeChild;

export type CalendarMonthHeaderRenderer = (props: { month: DateValue; index: number }) => VNodeChild;

export type CalendarDayProps = Omit<InteractionControlProps<CalendarRenderProps>, "ariaLabel"> & {
    /** Names the day for assistive technology, since the cell often shows only its number. Required here: a bare number is not a date. */
    ariaLabel: string;
    /** Runs when this day is picked. */
    onSelect: () => void;
};

export type CalendarBaseProps = BaseCalendarProps & {
    /** Which month is shown, which is what `v-model:month` binds. It is the only thing that pages the calendar. */
    "month": DateValue;
    /** Receives the month the calendar pages to. */
    "onUpdate:month"?: (month: DateValue) => void;
};

export type CalendarSlots = {
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
        /** Which day is picked, which is what `v-model:value` binds. It is the only thing that picks one. */
        "value": DateValue | undefined;
        /** Receives the day picked. */
        "onUpdate:value"?: (value: DateValue | undefined) => void;
    } & CalendarMonthCountExcludesPrecision;

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked, which is what `v-model:value` binds. It is the only thing that picks one. */
    "value": DateValueRange | undefined;
    /** Receives the range picked, and `undefined` while its second end is still to come. */
    "onUpdate:value"?: (value: DateValueRange | undefined) => void;
};
