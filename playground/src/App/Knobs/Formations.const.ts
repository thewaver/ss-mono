import { type PlacementLayouts, ProximityEffects } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

import { NO_SAMPLE_KEY } from "../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../PageComponents/SampleGroups/SampleGroups.types";

export namespace FormationKnobs {
    export const EFFECT_KEYS: WithNoSample<ProximityEffects.SampleKey>[] = [
        NO_SAMPLE_KEY,
        ...ProximityEffects.SAMPLE_KEYS,
    ];

    export const MIN_ITEM_COUNT = 1;
    export const MAX_ITEM_COUNT = 12;
    export const ITEM_COUNT_STEP = 1;
    export const MIN_SKIPPED_COUNT = 0;
    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;
    export const MIN_STAGGER_MS = 0;
    export const MAX_STAGGER_MS = 500;
    export const STAGGER_STEP_MS = 10;
    export const MIN_WIDTH = 60;
    export const MAX_WIDTH = 600;
    export const WIDTH_STEP = 10;

    export const STARTING_ITEM_COUNT = 6;
    export const STARTING_LAYOUT_KEY: PlacementLayouts.SampleKey = "row";
    export const STARTING_EFFECT_KEY: ProximityEffects.SampleKey = "zoom_in";
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const STARTING_IS_STACKED_IN_REVERSE = false;
    export const STARTING_WIDTHS: Record<PlacementLayouts.SampleKey, number> = {
        arc: 360,
        cliff: 240,
        column: 120,
        honeycomb: 360,
        ring: 360,
        row: 480,
        whorl: 240,
        zigzag: 240,
    };

    export const LAYOUT_KEY_TEXT = {
        label: "Arrangement",
        hint: "How the items are arranged: a ring, an arc, a row, a honeycomb, and so on. Choosing one brings its own knobs with it.",
        controls: "Picks the sample layout sent to FormationProps.computeLayout",
    };

    export const WIDTH_TEXT = {
        label: "Width (px)",
        hint: "How wide the box holding the arrangement is. Every arrangement is measured against it, so this scales the whole thing; each one starts at a width that suits it, and remembers yours.",
        controls: "Sets the width of the box the example's Formation fills",
    };

    export const EFFECT_KEY_TEXT = {
        label: "Pointer effect",
        hint: "What the items do as the pointer nears them. Choosing one brings its own knobs with it.",
        controls: "Picks the sample effect sent to FormationProps.computeEffect",
    };

    export const ITEM_COUNT_TEXT = {
        label: "Items",
        hint: "How many items the arrangement holds.",
        controls: "Sets the length of the slice of example items sent to FormationProps.items",
    };

    export const SKIPPED_COUNT_TEXT = {
        label: "Skip from the start",
        hint: "Leaves out that many items from the front of the list, so an item can be taken out from the start rather than the end.",
        controls: "Sets where the slice of example items sent to FormationProps.items starts",
    };

    export const IS_STACKED_IN_REVERSE_TEXT = {
        label: "Earlier items in front",
        hint: "Puts the first item on top of the pile instead of the last, which shows where two items overlap.",
        controls: "Sets FormationProps.isStackedInReverse",
    };

    export const SHAPE_KIND_TEXT = {
        label: "Item shape",
        hint: "The contour each item is cut to.",
        controls: "Picks the contour of the example items drawn by FormationProps.renderItem",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Glide (ms)",
        hint: "How long an item takes to glide to its new place when the arrangement, the item count or a knob changes. At 0 it moves at once, and under reduced motion it always does.",
        controls: "Sets FormationProps.transitionDurationMs",
    };

    export const TRANSITION_DELAY_MS_TEXT = {
        label: "Transition delay (ms)",
        hint: "How much later each item sets off than the one before it, while gliding is on.",
        controls: "Sets FormationProps.transitionDelayMs",
    };
}
