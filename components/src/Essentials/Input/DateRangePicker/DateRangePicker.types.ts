import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { DateValue, DateValueWeekStart } from "../../../Abstracts/DateValue/DateValue.types";

export type BaseDateRangePickerValues = {
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

export type BaseDateRangePickerCbs = {
    /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

export type BaseDateRangePickerProps = BaseDateRangePickerValues & BaseDateRangePickerCbs;
