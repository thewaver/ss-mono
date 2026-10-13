import type { Accessor, JSX } from "solid-js";

import type {
    BaseCalendarCbs,
    BaseCalendarPrecisionValues,
    BaseCalendarValues,
    CalendarRenderProps,
    DateValue,
    DateValueRange,
    InteractionFlags,
} from "@thewaver/ss-components";

import type { InteractionControlProps } from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type CalendarDayRenderer = (
    getDay: Accessor<DateValue>,
    getRenderProps: () => InteractionFlags<CalendarRenderProps>,
) => JSX.Element;

export type CalendarWeekdayRenderer = (name: string, index: number) => JSX.Element;

export type CalendarDayProps = AccessorProps<
    Omit<InteractionControlProps<CalendarRenderProps>, "renderContent"> & {
        /** Names the day for assistive technology, since the cell often shows only its number. Required here: a bare number is not a date. */
        ariaLabel: string;
        /** Draws the day cell. */
        renderContent: (getRenderProps: () => InteractionFlags<CalendarRenderProps>) => JSX.Element;
        /** Runs when this day is picked. */
        onSelect: () => void;
    }
>;

export type CalendarBaseProps = AccessorValues<BaseCalendarValues> &
    BaseCalendarCbs & {
        /** Which month is shown. It is the only thing that pages the calendar. */
        month: SignalSource<DateValue>;
        /** Draws one day cell. */
        renderDay: CalendarDayRenderer;
        /** Draws one weekday heading. */
        renderWeekday?: CalendarWeekdayRenderer;
    };

export type CalendarPrecisionProps = AccessorValues<BaseCalendarPrecisionValues>;

export type CalendarCompositeProps = CalendarBaseProps &
    CalendarPrecisionProps & {
        /** Whether a given day counts as picked, which is what separates picking one day from picking a range. */
        computeIsSelected: (day: DateValue) => boolean;
        /** The day a range is being measured from while one is being picked. */
        computeAnchorDay?: () => DateValue | undefined;
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
        /** Which day is picked. It is the only thing that picks one. */
        value: SignalSource<DateValue | undefined>;
    };

export type RangeCalendarProps = CalendarBaseProps & {
    /** Which range is picked. It is the only thing that picks one. */
    value: SignalSource<DateValueRange | undefined>;
};
