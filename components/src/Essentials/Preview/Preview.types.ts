export type PreviewSizing = "fit-content" | "fill";

export type PreviewFlags = {
    isExpanded: boolean;
};

export type BasePreviewValues = {
    /**
     * Identifies the preview's trigger. The content gets an id of its own, so this one names the control a consumer
     * labels.
     */
    id?: string;
    /** Whether the preview takes only the room its content needs, or fills the width it is given. */
    sizing?: PreviewSizing;
    /** How much of the content is shown while it is collapsed. */
    collapsedHeight: number;
    /**
     * Scrolls the preview back into view when it is collapsed, so the reader is not left further down the page than
     * they started.
     */
    isScrolledIntoViewOnCollapse?: boolean;
    /** How long the content takes to expand and collapse. */
    transitionDurationMs?: number;
};

export type BasePreviewProps = BasePreviewValues;
