import type { JSX } from "solid-js";

import type {
    BaseTimePickerCbs,
    BaseTimePickerValues,
    InteractionFlags,
    PopupTriggerFlags,
    TextFieldFlags,
    TimeInputMeridiem,
} from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";
import type { ClockColumnRenderer, ClockOptionRenderer, ClockUnitRenderer } from "../Clock/ClockSolid.types";
import type { TimeInputProps } from "../TimeInput/TimeInputSolid.types";

export type TimePickerProps = Omit<TimeInputProps, "renderTrailing"> &
    AccessorValues<BaseTimePickerValues> &
    BaseTimePickerCbs &
    AccessorProps<{
        /** Whether the clock is open. It is the only thing that opens or closes it. */
        visibility?: SignalSource<boolean>;
        /**
         * Draws whatever else sits after the field's text, before the control that opens the clock.
         *
         * The slot carries two controls on a twelve-hour field — the meridiem toggle and the clock trigger —
         * and only the trigger is the component's. This is where the rest goes.
         */
        renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem) => JSX.Element;
        /**
         * Draws what sits inside the control that opens the clock.
         *
         * The control itself is the component's — it owns the `aria-haspopup`, `aria-expanded` and
         * `aria-controls` that tell a reader the clock belongs to it, and that let the dismisser resolve a
         * press in the clock as a press inside this picker's layer rather than outside it. Everything painted
         * inside is the consumer's, and the element is a blank slate, so nothing about the look is fixed.
         */
        renderTrigger: (
            getFlags: () => InteractionFlags<PopupTriggerFlags>,
            meridiem: TimeInputMeridiem,
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
