export type SplitPaneOrientation = "horizontal" | "vertical";

export type SplitPaneGutterFlags = {
    isDragging: boolean;
};

export type SplitPaneEntry = {
    id?: string;
    minPx?: number;
    maxPx?: number;
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
