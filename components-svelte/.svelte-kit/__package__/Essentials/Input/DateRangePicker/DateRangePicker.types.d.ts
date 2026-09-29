import type { Snippet } from "svelte";
import type { AnchorPlacement, DateValue, DateValueRange, DateValueWeekStart, InteractionFlags, PopupTriggerFlags } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";
import type { ValuePair } from "../../../Utils/typeUtils.js";
import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types.js";
import type { DateInputProps } from "../DateInput/DateInput.types.js";
export type DateRangePickerProps = Omit<DateInputProps, "renderTrailing" | "value" | "ariaLabel" | "id" | "name"> & {
    /**
     * The fields' element id. The start field takes `<id>-start` and the end field `<id>-end`, so a label can
     * name each one and no id lands on two elements.
     */
    id?: string;
    /** The fields' name when they are submitted as part of a form. They submit as `<name>-start` and `<name>-end`. */
    name?: string;
    /** Where the calendar sits against the fields. */
    placement?: AnchorPlacement;
    /** How far the calendar is held clear of the fields. */
    offset?: Point2d;
    /** How long the calendar takes to fade in and out. */
    popupTransitionDurationMs?: number;
    /** Names the calendar for assistive technology. */
    calendarLabel: string;
    /** Names the start field for assistive technology. */
    startLabel: string;
    /** Names the end field for assistive technology. */
    endLabel: string;
    /** Which day begins a week, which decides the order of the column headings. */
    weekStartsOn?: DateValueWeekStart;
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
    /** The picked range. Bind it with `bind:value`; it is the only thing that picks one. */
    value: DateValueRange | undefined;
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
    /** Draws whatever sits between the two fields. */
    renderSeparator?: Snippet;
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
