import type { ReactNode } from "react";

import type {
    BaseDateRangePickerProps,
    DateValue,
    DateValueRange,
    InteractionFlags,
    PopupTriggerFlags,
} from "@thewaver/ss-components";

import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types";
import type { DateInputProps } from "../DateInput/DateInput.types";

export type DateRangePickerProps = Omit<DateInputProps, "renderTrailing" | "value" | "ariaLabel" | "id" | "name"> &
    BaseDateRangePickerProps & {
        /** The picked range, and how to change it. It is the only thing that picks one. */
        value: readonly [DateValueRange | undefined, (value: DateValueRange | undefined) => void];
        /** Whether the calendar is open, and how to change it. It is the only thing that opens or closes it. */
        visibility?: readonly [boolean, (isOpen: boolean) => void];
        /**
         * Draws what sits inside the control that opens the calendar.
         *
         * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
         * `aria-controls` that tell a reader the calendar belongs to it, and that let the dismisser resolve a
         * press in the calendar as a press inside this picker's layer rather than outside it. Everything
         * painted inside is the consumer's, and the element is a blank slate, so nothing about the look is
         * fixed.
         */
        renderTrigger: (flags: InteractionFlags<PopupTriggerFlags>) => ReactNode;
        /** Draws whatever sits between the two fields. */
        renderSeparator?: () => ReactNode;
        /** Draws one day cell. */
        renderDay: CalendarDayRenderer;
        /** Draws one weekday heading. */
        renderWeekday?: CalendarWeekdayRenderer;
        /**
         * Draws the surface the calendar sits on. The calendar is handed in rather than built, so the consumer decides
         * what surrounds it, and the visible month is handed in with it so the consumer can draw the title and paging
         * buttons.
         */
        renderPopup: (
            renderCalendar: () => ReactNode,
            month: readonly [DateValue, (month: DateValue) => void],
            visibilityTarget: 0 | 1,
            transitionDurationMs: number,
        ) => ReactNode;
    };
