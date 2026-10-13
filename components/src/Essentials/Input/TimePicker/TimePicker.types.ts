import type { Point2d, TimeValue } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { ClockSteps } from "../Clock/Clock.types";

export type BaseTimePickerValues = {
    /** Where the clock sits against the field. */
    placement?: AnchorPlacement;
    /** How far the clock is held clear of the field. */
    offset?: Point2d;
    /** How long the clock takes to fade in and out. */
    popupTransitionDurationMs?: number;
    /** Names the clock for assistive technology. */
    clockLabel: string;
    /** Which country's conventions the times are written in. */
    locale?: string;
    /** How far apart the offered times are, per unit. */
    clockSteps?: ClockSteps;
    /** The space between the clock's columns. */
    clockGap?: number;
    /**
     * The trigger's own element id, for a consumer that has to reach it from a label or a test.
     *
     * It is separate from the field's `id` because the two are different elements now that the component
     * owns the trigger.
     */
    triggerId?: string;
    /** Names the control that opens the clock. */
    triggerAriaLabel: string;
};

export type BaseTimePickerCbs = {
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    computeIsTimeDisabled?: (time: TimeValue) => boolean;
};

export type BaseTimePickerProps = BaseTimePickerValues & BaseTimePickerCbs;
