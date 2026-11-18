import type { CheckKnob, NumberKnob } from "../PageComponents/Knobs/KnobDefs.types";

type SelectKnob = Omit<CheckKnob, "kind">;

export namespace ScrollerKnobs {
    export const MIN_ITEM_COUNT = 1;
    export const MAX_ITEM_COUNT = 40;
    export const ITEM_COUNT_STEP = 1;
    export const STARTING_ITEM_COUNT = 12;
    export const MIN_OVERLAP_COUNT = 0;
    export const MAX_OVERLAP_COUNT = 2;
    export const OVERLAP_COUNT_STEP = 1;
    export const MIN_POSITION = 0;
    export const POSITION_STEP = 10;

    export const OVERFLOW_X: SelectKnob = {
        label: "Across",
        hint: "Whether the box scrolls across the page: auto shows the bar only while the content is too wide, scroll always shows it, hidden neither scrolls nor shows it.",
        controls: "Sets ScrollerProps.overflowX on the box scrolling both ways",
    };

    export const OVERFLOW_Y: SelectKnob = {
        label: "Down",
        hint: "Whether the box scrolls down the page, with the same three choices as across.",
        controls: "Sets ScrollerProps.overflowY on the box scrolling both ways",
    };

    export const IS_AUTO_HIDING: CheckKnob = {
        kind: "check",
        label: "Fading bars",
        hint: "Fades the bars while nothing is happening, and brings them back while the box scrolls or the pointer moves over it. A faded bar keeps its place.",
        controls: "Sets ScrollerProps.isAutoHiding on the box scrolling both ways",
    };

    export const IS_BAR_OVERLAID: CheckKnob = {
        kind: "check",
        label: "Bars over the content",
        hint: "Floats the bars over the content's edge instead of giving each a strip of its own beside it.",
        controls: "Sets ScrollerProps.isBarOverlaid on the box scrolling both ways",
    };

    export const HIDE_DELAY_MS: NumberKnob = {
        kind: "number",
        label: "Fade delay (ms)",
        hint: "How long a fading bar stays after the box stops scrolling.",
        controls: "Sets ScrollerProps.hideDelayMs on every example whose bars fade",
        min: 0,
        max: 3000,
        step: 100,
    };

    export const ITEM_COUNT_TEXT = {
        label: "Item count",
        hint: "How many items sit in the strip. Few enough to fit, and both buttons are disabled, since there is nowhere to go.",
        controls: "Sets the number of example items sent as Scroller's children",
    };

    export const OVERLAP_COUNT_TEXT = {
        label: "Overlap count",
        hint: "How many of the items in view stay in view after a press of a step button. At 0 a press moves on by as much as fits; a press always moves by at least one item.",
        controls: "Sets ScrollerProps.overlapCount",
    };

    export const POSITION_TEXT = {
        label: "Position (%)",
        hint: "How far along the strip is scrolled. It follows the strip as it moves, and a value typed here scrolls it there.",
        controls: "Sets ScrollerProps.progress, shown as a percentage",
    };
}
