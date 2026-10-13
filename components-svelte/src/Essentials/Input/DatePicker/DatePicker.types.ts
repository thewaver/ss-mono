import type { Snippet } from "svelte";

import type { BaseDatePickerProps, DateValue, InteractionFlags, PopupTriggerFlags } from "@thewaver/ss-components";

import type { ValuePair } from "../../../Utils/typeUtils.js";
import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types.js";
import type { DateInputProps } from "../DateInput/DateInput.types.js";

export type DatePickerProps = Omit<DateInputProps, "renderTrailing"> &
    BaseDatePickerProps & {
        /**
         * Whether the calendar is open. Bind it with `bind:visibility` to drive or follow it; left unbound, the picker
         * keeps its own. It is the only thing that opens or closes the calendar.
         */
        visibility?: boolean;
        /**
         * Draws what sits inside the control that opens the calendar.
         *
         * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
         * `aria-controls` that tell a reader the calendar belongs to it, and that let the dismisser resolve a
         * press in the calendar as a press inside this picker's layer rather than outside it. Everything
         * painted inside is the consumer's, and the element is a blank slate, so nothing about the look is
         * fixed.
         */
        renderTrigger: Snippet<[flags: InteractionFlags<PopupTriggerFlags>]>;
        /** Draws one day cell. */
        renderDay: CalendarDayRenderer;
        /** Draws one weekday heading. */
        renderWeekday?: CalendarWeekdayRenderer;
        /**
         * Draws the surface the calendar sits on. The calendar is handed in as a snippet rather than built, so the
         * consumer decides what surrounds it and draws it with `{@render renderCalendar()}`, and the visible month is
         * handed in with it, with the way to change it, so the consumer can draw the title and paging buttons.
         */
        renderPopup: Snippet<
            [
                renderCalendar: Snippet,
                month: ValuePair<DateValue>,
                visibilityTarget: 0 | 1,
                transitionDurationMs: number,
            ]
        >;
    };
