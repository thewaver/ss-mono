import type { JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextFieldFlags, TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types";
import type { AccessorProps } from "../../../Utils/typeUtils";

export type SegmentedInputCellFlags = {
    /**
     * Whether this is the cell the next typed character lands in: where the caret sits, or where the selection
     * starts. Exactly one cell has it while the field holds focus, and none does otherwise, so it is where a focus
     * ring belongs. A full field with the caret at its end gives it to the last cell.
     */
    hasCaret: boolean;
    /** Whether the cell's character is inside the selection. Never set while the field is unfocused. */
    isSelected: boolean;
};

export type SegmentedInputCellRenderProps = InteractionFlags<TextFieldFlags & SegmentedInputCellFlags> & {
    /** Where the cell sits in the value, from zero. */
    index: number;
    /** The character the cell holds, or `undefined` while the value does not reach it. */
    char: string | undefined;
};

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
> &
    AccessorProps<{
        /** How many cells the field has, which is also the most characters its value can hold. */
        cellCount: number;
        /** The space between two cells, in pixels. */
        gap?: number;
        /**
         * Answers whether one character may be typed or pasted into the field. A refused character is dropped
         * wherever it appears, so a pasted `123-456` lands as its six digits. Left out, only the digits `0` to `9` are
         * taken; a field that takes more should also say so through `inputMode`, which otherwise asks a phone for its
         * digit keyboard.
         */
        computeIsAllowed?: (char: string) => boolean;
        /**
         * Draws one cell. It is handed the character in that cell, where it sits, whether the caret is in it and
         * whether it is selected, beside the field's own state — so the caret, the selection and the focus ring are
         * all the painter's to draw, since the field itself draws none of them. The cells are hidden from assistive
         * technology, which reads the field's value instead.
         */
        renderCell: (getCell: () => SegmentedInputCellRenderProps) => JSX.Element;
    }>;
