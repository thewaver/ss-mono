import type { ReactNode } from "react";

import type {
    CalendarPrecision,
    CalendarRenderProps,
    DateValue,
    DateValueRange,
    DateValueWeekStart,
    DateValueWeekdayWidth,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type CalendarDayRenderer = (day: DateValue, flags: InteractionFlags<CalendarRenderProps>) => ReactNode;

export type CalendarWeekdayRenderer = (name: string, index: number) => ReactNode;

export type CalendarDayProps = Omit<InteractionControlProps<CalendarRenderProps>, "ariaLabel"> & {
    /** Names the day for assistive technology, since the cell often shows only its number. Required here: a bare number is not a date. */
    ariaLabel: string;
    /** Runs when this day is picked. */
    onSelect: () => void;
};

export type CalendarBaseProps = {
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
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
    /** Which month is shown, and how to change it. It is the only thing that pages the calendar. */
    monthState: readonly [DateValue, (month: DateValue) => void];
    /** Draws one day cell. */
    renderDay: CalendarDayRenderer;
    /** Draws one weekday heading. */
    renderWeekday?: CalendarWeekdayRenderer;
};

export type CalendarPrecisionProps = {
    /**
     * What one cell of the grid holds, which is what a pick sets. `day` is a month of days under weekday headings;
     * `month` is the year's months three to a row, and a pick sets the first of that month; `year` is twelve years,
     * three to a row, and a pick sets the first day of that year. A pick is clamped into `minValue` and `maxValue`,
     * and a cell is pickable while any of its days is. `monthState` still says which page is shown, the page keys
     * step a whole page — a month, a year, twelve years — and Shift with them a year under `day` and twelve pages
     * above it. The weekday props are read only by `day`.
     */
    precision?: CalendarPrecision;
};

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
        valueState: readonly [DateValue | undefined, (value: DateValue | undefined) => void];
    };

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked, and how to change it. It is the only thing that picks one. */
    valueState: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
};
