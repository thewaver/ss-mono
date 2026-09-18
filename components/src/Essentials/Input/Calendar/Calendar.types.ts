import type { Accessor, JSX } from "solid-js";

import type {
    DateValue,
    DateValueRange,
    DateValueWeekStart,
    DateValueWeekdayWidth,
} from "../../../Abstracts/DateValue/DateValue.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type CalendarRenderProps = {
    /** The day this cell stands for. */
    day: DateValue;
    /** Whether this day is picked. */
    isSelected: boolean;
    /** Whether this day is today. */
    isToday: boolean;
    /** Whether this day belongs to a neighbouring month, shown to fill the grid out. */
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

export type CalendarDayRenderer = (
    getDay: Accessor<DateValue>,
    getRenderProps: () => InteractionFlags<CalendarRenderProps>,
) => JSX.Element;

export type CalendarWeekdayRenderer = (name: string, index: number) => JSX.Element;

export type CalendarDayProps = AccessorProps<
    Omit<InteractionControlProps<CalendarRenderProps>, "renderContent"> & {
        ariaLabel: string;
        /** Draws the day cell. */
        renderContent: (getRenderProps: () => InteractionFlags<CalendarRenderProps>) => JSX.Element;
        /** Runs when this day is picked. */
        onSelect: () => void;
    }
>;

export type CalendarBaseProps = AccessorProps<{
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
    min?: DateValue;
    /** The latest day that can be picked. */
    max?: DateValue;
    /** Turns the calendar off, so no day can be picked and it cannot be paged. */
    isDisabled?: boolean;
    /** The space between day cells. */
    gap?: number;
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
    /** Which month is shown. It is the only thing that pages the calendar. */
    monthSignal: SignalSource<DateValue>;
    /** Draws one day cell. */
    renderDay: CalendarDayRenderer;
    /** Draws one weekday heading. */
    renderWeekday?: CalendarWeekdayRenderer;
}>;

export type CalendarCompositeProps = CalendarBaseProps & {
    /** Whether a given day counts as picked, which is what separates picking one day from picking a range. */
    computeIsSelected: (day: DateValue) => boolean;
    /** The day a range is being measured from while one is being picked. */
    computeAnchorDay?: () => DateValue | undefined;
    /**
     * The range that would result from ending it on a given day, which is what paints the stretch under the pointer.
     */
    computeRange?: (highlighted: DateValue) => DateValueRange | undefined;
    /** Runs when a day is picked. */
    onPick: (day: DateValue) => void;
};

export type CalendarProps = CalendarBaseProps & {
    /** Which day is picked. It is the only thing that picks one. */
    valueSignal: SignalSource<DateValue | undefined>;
};

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked. It is the only thing that picks one. */
    valueSignal: SignalSource<DateValueRange | undefined>;
};
