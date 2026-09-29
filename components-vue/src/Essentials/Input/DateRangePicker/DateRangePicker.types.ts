import type { Ref, VNodeChild } from "vue";

import type {
    AnchorPlacement,
    DateValue,
    DateValueRange,
    DateValueWeekStart,
    InteractionFlags,
    PopupTriggerFlags,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types";
import type { DateInputProps, DateInputSlots } from "../DateInput/DateInput.types";

export type DateRangePickerProps = Omit<DateInputProps, "value" | "onUpdate:value" | "ariaLabel" | "id" | "name"> & {
    /**
     * The fields' element id. The start field takes `<id>-start` and the end field `<id>-end`, so a label can
     * name each one and no id lands on two elements.
     */
    "id"?: string;
    /** The fields' name when they are submitted as part of a form. They submit as `<name>-start` and `<name>-end`. */
    "name"?: string;
    /** Where the calendar sits against the fields. */
    "placement"?: AnchorPlacement;
    /** How far the calendar is held clear of the fields. */
    "offset"?: Point2d;
    /** How long the calendar takes to fade in and out. */
    "popupTransitionDurationMs"?: number;
    /** Names the calendar for assistive technology. */
    "calendarLabel": string;
    /** Names the start field for assistive technology. */
    "startLabel": string;
    /** Names the end field for assistive technology. */
    "endLabel": string;
    /** Which day begins a week, which decides the order of the column headings. */
    "weekStartsOn"?: DateValueWeekStart;
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    "computeIsDayDisabled"?: (day: DateValue) => boolean;
    /** The picked range, which is what `v-model:value` binds. It is the only thing that picks one. */
    "value": DateValueRange | undefined;
    /** Receives the range once both ends are known, and `undefined` while either is missing. */
    "onUpdate:value"?: (value: DateValueRange | undefined) => void;
    /**
     * Whether the calendar is open, which is what `v-model:visibility` binds. Left unbound, the picker keeps its own.
     * It is the only thing that opens or closes it.
     */
    "visibility"?: boolean;
    /** Receives the calendar opening or closing. */
    "onUpdate:visibility"?: (isOpen: boolean) => void;
    /**
     * The trigger's own element id, for a consumer that has to reach it from a label or a test.
     *
     * It is separate from the field's `id` because the two are different elements now that the component
     * owns the trigger.
     */
    "triggerId"?: string;
    /** Names the control that opens the calendar. */
    "triggerAriaLabel": string;
};

export type DateRangePickerSlots = Omit<DateInputSlots, "renderTrailing"> & {
    /**
     * Draws what sits inside the control that opens the calendar.
     *
     * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
     * `aria-controls` that tell a reader the calendar belongs to it, and that let the dismisser resolve a
     * press in the calendar as a press inside this picker's layer rather than outside it. Everything
     * painted inside is the consumer's, and the element is a blank slate, so nothing about the look is
     * fixed.
     */
    renderTrigger: (flags: InteractionFlags<PopupTriggerFlags>) => VNodeChild;
    /** Draws whatever sits between the two fields. */
    renderSeparator?: () => VNodeChild;
    /** Draws one day cell. */
    renderDay: CalendarDayRenderer;
    /** Draws one weekday heading. */
    renderWeekday?: CalendarWeekdayRenderer;
    /**
     * Draws the surface the calendar sits on. The calendar is handed in rather than built, so the consumer decides
     * what surrounds it: `renderCalendar` draws it, from a template as `<component :is="renderCalendar" />`. The
     * visible month is handed in with it, as a ref the consumer may write, so they can draw the title and paging
     * buttons.
     */
    renderPopup: (props: {
        renderCalendar: () => VNodeChild;
        month: Ref<DateValue>;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
    }) => VNodeChild;
};
