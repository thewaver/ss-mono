import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { TextFieldFlags } from "../../../Primitives/TextField/TextField.types";

export type SegmentedInputSelection = {
    start: number;
    end: number;
};

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

export type BaseSegmentedInputValues = {
    /** How many cells the field has, which is also the most characters its value can hold. */
    cellCount: number;
    /** The space between two cells, in pixels. */
    gap?: number;
};

export type BaseSegmentedInputCbs = {
    /**
     * Answers whether one character may be typed or pasted into the field. A refused character is dropped wherever
     * it appears, so a pasted `123-456` lands as its six digits. Left out, only the digits `0` to `9` are taken; a
     * field that takes more should also say so through `inputMode`, which otherwise asks a phone for its digit
     * keyboard.
     */
    computeIsAllowed?: (char: string) => boolean;
};

export type BaseSegmentedInputProps = BaseSegmentedInputValues & BaseSegmentedInputCbs;
