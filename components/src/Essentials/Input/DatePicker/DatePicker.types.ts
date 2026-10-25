import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { DateValueWeekStart } from "../../../Abstracts/DateValue/DateValue.types";
import type { CalendarPrecision } from "../Calendar/Calendar.types";

export type BaseDatePickerValues = {
    /**
     * Where the calendar sits against the field. Left out, it hangs below the field lined up with the edge the text
     * starts from: the left, or the right where the field sits in right-to-left text. Given, it is used as it stands
     * in either direction.
     */
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
    /**
     * Names the control that opens the calendar. It is kept inside a `Label` too, since the caption names the field
     * and the control is a second one with a name of its own.
     */
    triggerAriaLabel: string;
};

export type BaseDatePickerProps = BaseDatePickerValues;
