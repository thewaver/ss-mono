import { type ArcDefs, PlacementLayoutUtils } from "@thewaver/ss-components";

import type { SizeValue } from "./RadioPage.types";

export const EXAMPLE_NAMES = {
    default: "Default",
    rightToLeft: "In a right-to-left box",
    segmented: "Segmented",
    rating: "Rating",
    arc: "Rating, bent into an arc",
    decorated: "Decorated",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
};

export const RADIO_GROUP_GAP = 10;

export const SIZE_OPTIONS: { value: SizeValue; label: string }[] = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
];

export const STARTING_RATING = 3;

export const EXAMPLES_ROOT = "/src/App/Pages/RadioPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/RadioPage/Docs";

export const ARC_DEFS: ArcDefs = {
    ovalHeightRatio: 0.25,
    spreadDegrees: 180,
    itemWidthRatio: 0.1,
    itemHeightRatio: 0.1,
};

export const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

export const ARC_WIDTH = "300px";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the radios run from the right too, and the left arrow moves on to the next one, while up and down keep their meaning.",
    },
    segmented: {
        title: "Segmented",
        content:
            "Set [prop]orientation[/prop] to horizontal and the radios sit side by side; [prop]renderSelectionFloater[/prop] then draws a marker that slides to the picked one, which is the look of a segmented control.",
    },
    rating: {
        title: "A rating",
        content:
            "Any value can stand behind a radio, numbers included, and the painter decides what each one looks like: here the stars fill up to the one under the pointer, or up to the pick.",
    },
    bentIntoArc: {
        title: "Bent into an arc",
        content:
            "Give the group [prop]computeLayout[/prop] and the radios are placed by a layout instead of laid in a row or a column, here along an arc. The arrow keys still walk them in the order they are written.",
    },
    decoration: {
        title: "Decoration",
        content:
            "Anything drawn over a radio goes through [prop]renderDecoration[/prop], which is handed the radio's state like the painter is: here a corner highlight marks the one picked.",
    },
    disabledOption: {
        title: "A disabled option",
        content:
            "One radio can be off while the rest work: the arrow keys skip it and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it without picking it, so its tooltip can say why it is off.",
    },
};
