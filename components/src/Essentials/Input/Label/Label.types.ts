export type LabelOrientation = "horizontal" | "vertical";

export type BaseLabelValues = {
    /** Whether the caption sits beside the control or above it. */
    orientation?: LabelOrientation;
    /** The space between the caption and the control. */
    gap?: number;
};

export type BaseLabelProps = BaseLabelValues;
