import type { VNodeChild } from "vue";

import type {
    AnchorPlacement,
    ClockSteps,
    InteractionFlags,
    PopupTriggerFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";
import type { Point2d, TimeValue } from "@thewaver/ss-utils";

import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/Clock.types";
import type { TimeInputMeridiem, TimeInputProps, TimeInputSlots } from "../TimeInput/TimeInput.types";

export type TimePickerProps = TimeInputProps & {
    /** Where the clock sits against the field. */
    "placement"?: AnchorPlacement;
    /** How far the clock is held clear of the field. */
    "offset"?: Point2d;
    /** How long the clock takes to fade in and out. */
    "popupTransitionDurationMs"?: number;
    /** Names the clock for assistive technology. */
    "clockLabel": string;
    /** Which country's conventions the times are written in. */
    "locale"?: string;
    /** How far apart the offered times are, per unit. */
    "clockSteps"?: ClockSteps;
    /** The space between the clock's columns. */
    "clockGap"?: number;
    /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
    "computeIsTimeDisabled"?: (time: TimeValue) => boolean;
    /**
     * Whether the clock is open, which is what `v-model:visibility` binds. Left unbound, the picker keeps its own.
     * It is the only thing that opens or closes it.
     */
    "visibility"?: boolean;
    /** Receives the clock opening or closing. */
    "onUpdate:visibility"?: (isOpen: boolean) => void;
    /**
     * The trigger's own element id, for a consumer that has to reach it from a label or a test.
     *
     * It is separate from the field's `id` because the two are different elements now that the component
     * owns the trigger.
     */
    "triggerId"?: string;
    /** Names the control that opens the clock. */
    "triggerAriaLabel": string;
};

export type TimePickerSlots = Omit<TimeInputSlots, "renderTrailing"> & {
    /**
     * Draws whatever else sits after the field's text, before the control that opens the clock.
     *
     * The slot carries two controls on a twelve-hour field — the meridiem toggle and the clock trigger —
     * and only the trigger is the component's. This is where the rest goes.
     */
    renderTrailing?: (props: { flags: InteractionFlags<TextFieldFlags>; meridiem: TimeInputMeridiem }) => VNodeChild;
    /**
     * Draws what sits inside the control that opens the clock.
     *
     * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
     * `aria-controls` that tell a reader the clock belongs to it, and that let the dismisser resolve a
     * press in the clock as a press inside this picker's layer rather than outside it. Everything painted
     * inside is the consumer's, and the element is a blank slate, so nothing about the look is fixed.
     */
    renderTrigger: (props: { flags: InteractionFlags<PopupTriggerFlags>; meridiem: TimeInputMeridiem }) => VNodeChild;
    /** Draws one clock option. */
    renderOption: ClockOptionRenderer;
    /** Draws the heading for one of the clock's columns. */
    renderUnit?: ClockUnitRenderer;
    /** Draws one of the clock's columns. */
    renderColumn?: ClockColumnRenderer;
    /**
     * Draws the surface the clock sits on. `renderClock` draws the clock, from a template as
     * `<component :is="renderClock" />`.
     */
    renderPopup: (props: {
        renderClock: () => VNodeChild;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
    }) => VNodeChild;
};
