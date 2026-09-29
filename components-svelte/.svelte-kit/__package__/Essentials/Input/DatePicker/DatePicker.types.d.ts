import type { Snippet } from "svelte";
import type { AnchorPlacement, CalendarPrecision, DateValue, DateValueWeekStart, InteractionFlags, PopupTriggerFlags } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";
import type { ValuePair } from "../../../Utils/typeUtils.js";
import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types.js";
import type { DateInputProps } from "../DateInput/DateInput.types.js";
export type DatePickerProps = Omit<DateInputProps, "renderTrailing"> & {
    /** Where the calendar sits against the field. */
    placement?: AnchorPlacement;
    /** How far the calendar is held clear of the field. */
    offset?: Point2d;
    /** How long the calendar takes to fade in and out. */
    popupTransitionDurationMs?: number;
    /** Names the calendar for assistive technology. */
    calendarLabel: string;
    /** Which day begins a week, which decides the order of the column headings. */
    weekStartsOn?: DateValueWeekStart;
    /**
     * What one cell of the popup's calendar holds — days, months or years — and so what a pick there sets.
     * It is handed to the calendar as it stands; the field still takes a whole date.
     */
    precision?: CalendarPrecision;
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
    /**
     * Whether the calendar is open. Bind it with `bind:visibility` to drive or follow it; left unbound, the picker
     * keeps its own. It is the only thing that opens or closes the calendar.
     */
    visibility?: boolean;
    /**
     * The trigger's own element id, for a consumer that has to reach it from a label or a test.
     *
     * It is separate from the field's `id` because the two are different elements now that the component
     * owns the trigger.
     */
    triggerId?: string;
    /** Names the control that opens the calendar. */
    triggerAriaLabel: string;
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
    renderPopup: Snippet<[
        renderCalendar: Snippet,
        month: ValuePair<DateValue>,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number
    ]>;
};
