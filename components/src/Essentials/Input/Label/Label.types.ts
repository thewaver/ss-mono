export type LabelOrientation = "horizontal" | "vertical";

export type BaseLabelValues = {
    /** Whether the caption sits beside the control or above it. */
    orientation?: LabelOrientation;
    /** The space between the caption and the control. */
    gap?: number;
    /**
     * The id of the control the caption names, as on a native label. Left out, a control inside that knows which of its
     * parts is the real one — `TagInput`'s text box, rather than the remove buttons before it — names it itself, and
     * otherwise the caption names the first control it wraps, as a native label does. Ignored on a `Label` nested
     * inside another, which draws no label of its own.
     */
    for?: string;
};

export type BaseLabelProps = BaseLabelValues;
