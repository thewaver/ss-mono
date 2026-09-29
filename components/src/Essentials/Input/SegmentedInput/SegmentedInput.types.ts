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
