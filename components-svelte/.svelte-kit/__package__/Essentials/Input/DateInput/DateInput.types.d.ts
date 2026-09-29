import type { Snippet } from "svelte";
import type { DateInputFormat, DateInputPart, DateValue, DateValueCalendarId, DateValueEra, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";
import type { TextFieldProps } from "../../../Primitives/TextField/TextField.types.js";
export type DateInputEra = {
    /** The id of the era the field's year is counted within. */
    value: string;
    /** Every era the calendar reports, earliest first. */
    options: DateValueEra[];
    /** Moves the field into another era, keeping the year, month and day it shows. */
    set: (next: string) => void;
};
export type DateInputProps = Omit<TextFieldProps, "value" | "element" | "type" | "inputMode" | "computeMaskedText" | "placeholderHint" | "isSpinButton" | "computeSpinValue" | "isAutoSizing" | "minRows" | "maxRows" | "min" | "max" | "step" | "renderLeading" | "onInput" | "onBlur"> & {
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
    /** The date. Bind it with `bind:value`; it is the only thing that changes it. */
    value: DateValue | undefined;
    /** Draws whatever sits before the field's text, inside the field. */
    renderLeading?: Snippet<[flags: InteractionFlags<TextFieldFlags>, era: DateInputEra]>;
};
