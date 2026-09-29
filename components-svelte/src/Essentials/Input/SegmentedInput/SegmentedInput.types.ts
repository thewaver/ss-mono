import type { Snippet } from "svelte";

import type { SegmentedInputCellRenderProps } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types.js";

export type SegmentedInputProps = Omit<
    TextFieldPresetProps,
    | "type"
    | "padding"
    | "gap"
    | "placeholderHint"
    | "min"
    | "max"
    | "step"
    | "computeMaskedText"
    | "computeTextStyle"
    | "renderContent"
    | "renderPlaceholder"
    | "renderLeading"
    | "renderTrailing"
> & {
    /** How many cells the field has, which is also the most characters its value can hold. */
    cellCount: number;
    /** The space between two cells, in pixels. */
    gap?: number;
    /**
     * Answers whether one character may be typed or pasted into the field. A refused character is dropped wherever
     * it appears, so a pasted `123-456` lands as its six digits. Left out, only the digits `0` to `9` are taken; a
     * field that takes more should also say so through `inputMode`, which otherwise asks a phone for its digit
     * keyboard.
     */
    computeIsAllowed?: (char: string) => boolean;
    /**
     * Draws one cell. It is handed the character in that cell, where it sits, whether the caret is in it and whether
     * it is selected, beside the field's own state — so the caret, the selection and the focus ring are all the
     * painter's to draw, since the field itself draws none of them. The cells are hidden from assistive technology,
     * which reads the field's value instead.
     */
    renderCell: Snippet<[cell: SegmentedInputCellRenderProps]>;
};
