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
