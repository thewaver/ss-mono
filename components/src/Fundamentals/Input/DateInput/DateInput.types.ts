import type { JSX } from "solid-js";

import type { DateValue, DateValueCalendarId, DateValueEra } from "../../../Abstracts/DateValue/DateValue.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { TextFieldFlags, TextFieldProps } from "../TextField/TextField.types";

export type DateInputFormat = "iso" | "day-month-year" | "month-day-year";

export type DateInputEra = {
    getValue: () => string;
    getOptions: () => DateValueEra[];
    set: (next: string) => void;
};

export type DateInputProps = Omit<
    TextFieldProps,
    | "valueSignal"
    | "element"
    | "type"
    | "inputMode"
    | "computeMaskedText"
    | "placeholderHint"
    | "isSpinButton"
    | "isAutoSizing"
    | "minRows"
    | "maxRows"
    | "min"
    | "max"
    | "step"
    | "renderLeading"
    | "onInput"
    | "onBlur"
> &
    AccessorProps<{
        minDate?: DateValue;
        maxDate?: DateValue;
        format?: DateInputFormat;
        calendar?: DateValueCalendarId;
        locale?: string;
        valueSignal: SignalSource<DateValue | undefined>;
        renderLeading?: (getFlags: () => InteractionFlags<TextFieldFlags>, era: DateInputEra) => JSX.Element;
    }>;
