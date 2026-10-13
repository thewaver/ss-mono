import type { SplitPaneEntry } from "@thewaver/ss-components";

export const PAIR: SplitPaneEntry[] = [
    { id: "split-pair-start", gutterAriaLabel: "Resize navigation" },
    { id: "split-pair-end" },
];

export const RIGHT_TO_LEFT: SplitPaneEntry[] = [
    { id: "split-rtl-start", gutterAriaLabel: "Resize navigation" },
    { id: "split-rtl-end" },
];

export const BOUNDED: SplitPaneEntry[] = [
    { id: "split-bounded-start", minPx: 120, maxPx: 220, gutterAriaLabel: "Resize sidebar" },
    { id: "split-bounded-end", minPx: 160 },
];

export const CRAMPED: SplitPaneEntry[] = [
    { id: "split-cramped-start", minPx: 250, gutterAriaLabel: "Resize left" },
    { id: "split-cramped-end", minPx: 400 },
];

export const TRIPLE: SplitPaneEntry[] = [
    { id: "split-triple-start", minPx: 80, gutterAriaLabel: "Resize first" },
    { id: "split-triple-middle", minPx: 80, gutterAriaLabel: "Resize second" },
    { id: "split-triple-end", minPx: 80 },
];

export const COMPARE: SplitPaneEntry[] = [
    { id: "split-compare-start", gutterAriaLabel: "Move the comparison line" },
    { id: "split-compare-end" },
];

export const EXAMPLE_NAMES = {
    pair: "Two panes",
    rightToLeft: "In a right-to-left box",
    bounded: "Bounded panes",
    triple: "Three panes",
    stacked: "Stacked",
    compare: "Two pictures",
    cramped: "Minimums that do not fit",
};

export const GUTTER_FIELD_WIDTH = 90;

export const PERCENT = 100;

export const EXAMPLES_ROOT = "/src/App/Pages/SplitPanePage/Examples";

export const STARTING_PAIR = [0.3, 0.7];

export const STARTING_RIGHT_TO_LEFT = [0.3, 0.7];

export const STARTING_BOUNDED = [0.3, 0.7];

export const STARTING_CRAMPED = [0.5, 0.5];

export const STARTING_TRIPLE = [0.25, 0.5, 0.25];

export const STARTING_COLUMN = [0.4, 0.6];

export const STARTING_COMPARE = [0.5, 0.5];
