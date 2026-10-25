import type { JSX, Signal } from "solid-js";

import type {
    BaseDateRangePickerValues,
    DateValue,
    DateValueRange,
    InteractionFlags,
    PopupTriggerFlags,
} from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";
import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/CalendarSolid.types";
import type { DateInputProps } from "../DateInput/DateInputSolid.types";

export type DateRangePickerProps = Omit<DateInputProps, "renderTrailing" | "value" | "ariaLabel" | "id" | "name"> &
    AccessorValues<BaseDateRangePickerValues> &
    AccessorProps<{
        /** The picked range. It is the only thing that picks one. */
        value: SignalSource<DateValueRange | undefined>;
        /** Whether the calendar is open. It is the only thing that opens or closes it. */
        visibility?: SignalSource<boolean>;
        /**
         * Draws what sits inside the control that opens the calendar.
         *
         * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
         * `aria-controls` that tell a reader the calendar belongs to it, and that let the dismisser resolve a
         * press in the calendar as a press inside this picker's layer rather than outside it. Everything
         * painted inside is the consumer's, and the element is a blank slate, so nothing about the look is
         * fixed.
         */
        renderTrigger: (getFlags: () => InteractionFlags<PopupTriggerFlags>) => JSX.Element;
        /** Draws whatever sits between the two fields. */
        renderSeparator?: () => JSX.Element;
        /** Draws one day cell. */
        renderDay: CalendarDayRenderer;
        /** Draws one weekday heading. */
        renderWeekday?: CalendarWeekdayRenderer;
        /**
         * Draws the surface the calendar sits on. The calendar is handed in rather than built, so the consumer decides
         * what surrounds it.
         */
        renderPopup: (
            renderCalendar: () => JSX.Element,
            month: Signal<DateValue>,
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }>;
