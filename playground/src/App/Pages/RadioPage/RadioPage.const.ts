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
