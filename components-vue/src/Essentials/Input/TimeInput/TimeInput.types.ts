import type { VNodeChild } from "vue";

import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";
import type { TimeValue, TimeValueMeridiem, TimeValueUnit } from "@thewaver/ss-utils";

import type { TextFieldProps, TextFieldSlots } from "../../../Primitives/TextField/TextField.types";

export type TimeInputMeridiem = {
    /** The half of the day the field reads its hour in. */
    value: TimeValueMeridiem;
    /** Moves the field into a half of the day, shifting the value by twelve hours when there is one. */
    set: (meridiem: TimeValueMeridiem) => void;
    /** Moves the field into the other half of the day. */
    toggle: () => void;
};

export type TimeInputProps = Omit<
    TextFieldProps,
    | "value"
    | "onUpdate:value"
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
    | "onInput"
    | "onBlur"
    | "onKeyDown"
> & {
    /** The earliest time that can be entered. */
    "minValue"?: TimeValue;
    /** The latest time that can be entered. */
    "maxValue"?: TimeValue;
    /** Whether seconds are part of the value as well as hours and minutes. */
    "hasSeconds"?: boolean;
    /** Whether times are written as twelve hours with a morning and afternoon marker, or as twenty-four. */
    "isTwelveHour"?: boolean;
    /**
     * The letters that stand for each part of the time in the format hint handed to `renderPlaceholder`. The
     * field joins them with a colon, and leaves out seconds when the time has none.
     */
    "segmentHints": Record<TimeValueUnit, string>;
    /** The time, which is what `v-model:value` binds. It is the only thing that changes it. */
    "value": TimeValue | undefined;
    /** Receives the time once what is typed makes a whole one, and `undefined` once the field is emptied. */
    "onUpdate:value"?: (value: TimeValue | undefined) => void;
};

export type TimeInputSlots = Omit<TextFieldSlots, "renderTrailing"> & {
    /**
     * Draws whatever sits after the field's text, inside the field, and is handed the half of the day the hour is
     * read in, which is where a twelve-hour field's meridiem toggle goes.
     */
    renderTrailing?: (props: { flags: InteractionFlags<TextFieldFlags>; meridiem: TimeInputMeridiem }) => VNodeChild;
};
