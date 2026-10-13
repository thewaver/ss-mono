import type { JSX } from "solid-js";

import type {
    BaseNumberInputCbs,
    BaseNumberInputValues,
    InteractionFlags,
    NumberInputStepper,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type NumberInputProps = Omit<
    TextFieldPresetProps,
    "type" | "autoComplete" | "value" | "renderTrailing" | "onInput"
> &
    AccessorValues<BaseNumberInputValues> &
    BaseNumberInputCbs & {
        /** The number. It is the only thing that changes it. */
        value: SignalSource<number | undefined>;
        /** Draws whatever sits after the field's text, inside the field — usually the stepper. */
        renderTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>, stepper: NumberInputStepper) => JSX.Element;
    };
