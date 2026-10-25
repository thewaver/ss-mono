export type SplitPaneOrientation = "horizontal" | "vertical";

export type SplitPaneGutterFlags = {
    isDragging: boolean;
};

export type SplitPaneEntry = {
    /** The pane's id, which the divider before it points at. Left out, one is generated. */
    id?: string;
    /**
     * The smallest the pane may be, in pixels. A divider stops here, and a container too small for every pane's
     * smallest size overflows.
     */
    minPx?: number;
    /** The largest the pane may be, in pixels. */
    maxPx?: number;
    /**
     * Names the divider after this pane for assistive technology, saying what moving it resizes. Every pane but the
     * last needs one, and a missing one is warned about in the console; the last pane has no divider after it.
     */
    gutterAriaLabel?: string;
};

export type SplitPaneCollapsedBoundaries = Record<number, { restore: number; collapsedAt: number }>;

export type SplitPaneKeyAction = "toggle" | "home" | "end" | "decrease" | "increase";

export type BaseSplitPaneValues = {
    /**
     * Whether the panes sit side by side, `"horizontal"`, or stacked, `"vertical"`. The dividers run the other way,
     * so a horizontal split has upright dividers.
     */
    orientation?: SplitPaneOrientation;
    /** How wide the draggable divider between two panes is. */
    gutterSize?: number;
    /** How far one press of an arrow key moves a divider. */
    keyStep?: number;
    /** Names the split for assistive technology. */
    ariaLabel?: string;
    /** Turns the dividers off, so the panes keep the sizes they have. */
    isDisabled?: boolean;
    /** The panes, each able to state its own smallest and largest size. */
    panes: SplitPaneEntry[];
};

export type BaseSplitPaneProps = BaseSplitPaneValues;
