import type { JSX } from "solid-js";

import type { DateValue, DateValueCalendarId, DateValueEra } from "../../../Abstracts/DateValue/DateValue.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextFieldFlags, TextFieldProps } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type DateInputFormat = "iso" | "day-month-year" | "month-day-year";

export type DateInputPart = "year" | "month" | "day";

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
    | "computeSpinValue"
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
        /** The earliest date that can be entered. */
        minValue?: DateValue;
        /** The latest date that can be entered. */
        maxValue?: DateValue;
        /** The order and separators the date is written in. */
        format?: DateInputFormat;
        /** Which calendar system the date is read and written in. */
        calendar?: DateValueCalendarId;
        /** Which country's conventions decide the default format and names. */
        locale?: string;
        /**
         * The letters that stand for each part of the date in the format hint handed to `renderPlaceholder`. The
         * field puts them in the order the format writes the parts and joins them with its separator.
         */
        partHints: Record<DateInputPart, string>;
        /** The date. It is the only thing that changes it. */
        valueSignal: SignalSource<DateValue | undefined>;
        /** Draws whatever sits before the field's text, inside the field. */
        renderLeading?: (getFlags: () => InteractionFlags<TextFieldFlags>, era: DateInputEra) => JSX.Element;
    }>;
