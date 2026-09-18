import type { JSX } from "solid-js";

import type { Point2d, TimeValue } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextFieldFlags } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { ClockColumnRenderer, ClockOptionRenderer, ClockSteps, ClockUnitRenderer } from "../Clock/Clock.types";
import type { TimeInputMeridiem, TimeInputProps } from "../TimeInput/TimeInput.types";

export type TimePickerTrigger = {
    getIsOpen: () => boolean;
    toggle: () => void;
};

export type TimePickerProps = Omit<TimeInputProps, "renderTrailing"> &
    AccessorProps<{
        /** Where the clock sits against the field. */
        placement?: AnchorPlacement;
        /** How far the clock is held clear of the field. */
        offset?: Point2d;
        /** How long the clock takes to fade in and out. */
        popupTransitionDurationMs?: number;
        /** Names the clock for assistive technology. */
        clockLabel?: string;
        /** Which country's conventions the times are written in. */
        locale?: string;
        /** How far apart the offered times are, per unit. */
        clockSteps?: ClockSteps;
        /** The space between the clock's columns. */
        clockGap?: number;
        /** Whether one time can be picked, for rules a plain earliest and latest cannot express. */
        computeIsTimeDisabled?: (time: TimeValue) => boolean;
        /** Whether the clock is open. It is the only thing that opens or closes it. */
        visibilitySignal?: SignalSource<boolean>;
        /** Draws whatever sits after the field's text, inside the field — usually the control that opens the clock. */
        renderTrailing: (
            getFlags: () => InteractionFlags<TextFieldFlags>,
            meridiem: TimeInputMeridiem,
            trigger: TimePickerTrigger,
        ) => JSX.Element;
        /** Draws one clock option. */
        renderOption: ClockOptionRenderer;
        /** Draws the heading for one of the clock's columns. */
        renderUnit?: ClockUnitRenderer;
        /** Draws one of the clock's columns. */
        renderColumn?: ClockColumnRenderer;
        /** Draws the surface the clock sits on. */
        renderPopup: (
            renderClock: () => JSX.Element,
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }>;
