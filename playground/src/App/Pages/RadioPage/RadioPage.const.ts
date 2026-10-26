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
