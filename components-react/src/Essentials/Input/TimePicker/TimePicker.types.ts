import type { ReactNode } from "react";

import type { BaseTimePickerProps, InteractionFlags, PopupTriggerFlags, TextFieldFlags } from "@thewaver/ss-components";

import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/Clock.types";
import type { TimeInputMeridiem, TimeInputProps } from "../TimeInput/TimeInput.types";

export type TimePickerProps = Omit<TimeInputProps, "renderTrailing"> &
    BaseTimePickerProps & {
        /** Whether the clock is open, and how to change it. It is the only thing that opens or closes it. */
        visibility?: readonly [boolean, (isOpen: boolean) => void];
        /**
         * Draws whatever else sits after the field's text, before the control that opens the clock.
         *
         * The slot carries two controls on a twelve-hour field — the meridiem toggle and the clock trigger —
         * and only the trigger is the component's. This is where the rest goes.
         */
        renderTrailing?: (flags: InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem) => ReactNode;
        /**
         * Draws what sits inside the control that opens the clock.
         *
         * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
         * `aria-controls` that tell a reader the clock belongs to it, and that let the dismisser resolve a
         * press in the clock as a press inside this picker's layer rather than outside it. Everything painted
         * inside is the consumer's, and the element is a blank slate, so nothing about the look is fixed.
         */
        renderTrigger: (flags: InteractionFlags<PopupTriggerFlags>, meridiem: TimeInputMeridiem) => ReactNode;
        /** Draws one clock option. */
        renderOption: ClockOptionRenderer;
        /** Draws the heading for one of the clock's columns. */
        renderUnit?: ClockUnitRenderer;
        /** Draws one of the clock's columns. */
        renderColumn?: ClockColumnRenderer;
        /** Draws the surface the clock sits on. */
        renderPopup: (renderClock: () => ReactNode, visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
    };
