import type { Ref, VNodeChild } from "vue";

import type {
    BaseDateRangePickerProps,
    DateValue,
    DateValueRange,
    InteractionFlags,
    PopupTriggerFlags,
} from "@thewaver/ss-components";

import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types";
import type { DateInputProps, DateInputSlots } from "../DateInput/DateInput.types";

export type DateRangePickerProps = Omit<DateInputProps, "value" | "onUpdate:value" | "ariaLabel" | "id" | "name"> &
    BaseDateRangePickerProps & {
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
