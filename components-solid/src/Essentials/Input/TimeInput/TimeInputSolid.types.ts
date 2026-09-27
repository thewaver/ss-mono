import type { JSX } from "solid-js";

import type { InteractionFlags, TextFieldFlags, TimeInputMeridiem } from "@thewaver/ss-components";
import type { TimeValue, TimeValueUnit } from "@thewaver/ss-utils";

import type { TextFieldProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type TimeInputProps = Omit<
    TextFieldProps,
    | "valueSignal"
    | "element"
    | "type"
    | "inputMode"
    | "computeMaskedText"
    | "placeholderHint"
    | "isSpinButton"
    | "computeSpinValue"
    | "isAutoSizing"
    | "minRows"
    | "maxRows"
    | "min"
    | "max"
    | "step"
    | "renderTrailing"
    | "onInput"
    | "onBlur"
    | "onKeyDown"
> &
    AccessorProps<{
        /** The earliest time that can be entered. */
        minValue?: TimeValue;
        /** The latest time that can be entered. */
        maxValue?: TimeValue;
        /** Whether seconds are part of the value as well as hours and minutes. */
        hasSeconds?: boolean;
        /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
        isTwelveHour?: boolean;
        /**
         * The letters that stand for each part of the time in the format hint handed to `renderPlaceholder`. The
         * field joins them with a colon, and leaves out seconds when the time has none.
         */
        segmentHints: Record<TimeValueUnit, string>;
        /** The time. It is the only thing that changes it. */
        valueSignal: SignalSource<TimeValue | undefined>;
        /** Draws whatever sits after the field's text, inside the field. */
        renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem) => JSX.Element;
    }>;
