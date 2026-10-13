import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { DateValue, DateValueWeekStart } from "../../../Abstracts/DateValue/DateValue.types";
import type { CalendarPrecision } from "../Calendar/Calendar.types";

export type BaseDatePickerValues = {
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
    /**
     * The trigger's own element id, for a consumer that has to reach it from a label or a test.
     *
     * It is separate from the field's `id` because the two are different elements now that the component
     * owns the trigger.
     */
    triggerId?: string;
    /** Names the control that opens the calendar. */
    triggerAriaLabel: string;
};

export type BaseDatePickerCbs = {
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

export type BaseDatePickerProps = BaseDatePickerValues & BaseDatePickerCbs;
