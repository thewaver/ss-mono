import type { SelectOptionRecord } from "@thewaver/ss-components";

export const SIZES: SelectOptionRecord<string, never>[] = [
    { value: "XS" },
    { value: "S" },
    { value: "M" },
    { value: "L", isDisabled: true },
    { value: "XL" },
];

export const DOCS_ROOT = "/src/App/Pages/ListboxPage/Docs";

export const DOCS_SECTIONS = {
    severalValuesGroups: {
        title: "Several values, in groups",
        content:
            "For more than one value, use MultiListbox: Enter or Space picks the focused option and pressing it again drops it, and every pick is held in one [prop]values[/prop] list. Options can sit in groups under headings drawn by [prop]renderGroupHeader[/prop]: a screen reader announces each group's name, and the arrow keys walk past the headings from one group into the next, skipping a disabled option such as Finland.",
    },
    horizontalRightLeft: {
        title: "Horizontal, right to left",
        content:
            "Set [prop]orientation[/prop] to horizontal and the options run across, walked by the left and right arrows instead of the up and down ones. A horizontal list follows the text's direction, so inside a box whose text runs right to left the options start from the right and the left arrow moves forward. A vertical one keeps the up and down arrows, and its options read from the right. L is disabled, so the arrows skip it.",
    },
    markersThatGlide: {
        title: "Markers that glide",
        content:
            "Give the list [prop]renderSelectionFloater[/prop] and one marker sits behind the picked option and slides to each new pick; give it [prop]renderHighlightFloater[/prop] and a second slides to whichever option the pointer or the arrows are on. Without them, each option paints its own highlight from the flags it is handed.",
    },
};

export const SHIPPING_COUNTRY_GLIDING_LABEL = "Shipping country, gliding";

export const COUNTRIES_SHIP_LABEL = "Countries to ship to";
