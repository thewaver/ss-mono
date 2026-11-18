import type { SplitPaneEntry } from "@thewaver/ss-components";

import knight_date from "../../knight_date.webp";
import knight_profile from "../../knight_profile.webp";

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

export const DOCS_ROOT = "/src/App/Pages/SplitPanePage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the first pane sits on the right, and the divider follows the pointer and the arrow keys from that side: the left arrow grows the first pane.",
    },
    boundedPanes: {
        title: "Bounded panes",
        content:
            "Each entry in [prop]panes[/prop] can give its pane a [prop]minPx[/prop] and a [prop]maxPx[/prop]. The pane is held between them whatever its ratio says, so this sidebar stays between 120 and 220 pixels wide while the stored ratio is left as the reader set it.",
    },
    threePanes: {
        title: "Three panes",
        content:
            "Any number of panes works the same way, with a divider between each pair. A divider moves its two neighbors and nothing else, so dragging at one end never changes the far side.",
    },
    twoPictures: {
        title: "Two pictures",
        content:
            "The panes are the painter's, so they need not squeeze what is in them. Here both pictures are drawn at the full width of the frame, and each pane shows only its own side, so the divider wipes from one picture to the other.",
    },
    minimumsThatDoNotFit: {
        title: "Minimums that do not fit",
        content:
            "When the panes' minimums add up to more than the box, the panes keep them and the row overflows, as a CSS grid does: here minimums of 250 and 400 pixels sit in a box at most 600 pixels wide, which scrolls.",
    },
};

export const PICTURES = [
    { src: knight_profile, alt: "The knight in an office" },
    { src: knight_date, alt: "The knight at a candlelit table" },
];

export const COMPARE_TWO_PICTURES_LABEL = "Compare two pictures";

export const TWO_PANES_RIGHT_LEFT_LABEL = "Two panes in a right-to-left box";
