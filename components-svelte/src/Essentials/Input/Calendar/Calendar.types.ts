import type { Snippet } from "svelte";

import type {
    BaseCalendarPrecisionValues,
    BaseCalendarProps,
    CalendarRenderProps,
    DateValue,
    DateValueRange,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type CalendarDayRenderer = Snippet<[day: DateValue, flags: InteractionFlags<CalendarRenderProps>]>;

export type CalendarWeekdayRenderer = Snippet<[name: string, index: number]>;

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
    };

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked. Bind it with `bind:value`; it is the only thing that picks one. */
    value: DateValueRange | undefined;
};
