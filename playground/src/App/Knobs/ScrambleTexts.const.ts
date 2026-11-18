import { ScrambleTextGlyphs, ScrambleTextWeights } from "@thewaver/ss-components";

export namespace ScrambleTextKnobs {
    export const GLYPH_SETS = ["library", ...ScrambleTextGlyphs.SAMPLE_KEYS] as const;
    export const SETTLE_ORDERS = ["left_to_right", ...ScrambleTextWeights.SAMPLE_KEYS] as const;

    export const MIN_SETTLE_DURATION_MS = 0;
    export const MAX_SETTLE_DURATION_MS = 4000;
    export const SETTLE_DURATION_STEP_MS = 100;
    export const MIN_SCRAMBLE_INTERVAL_MS = 10;
    export const MAX_SCRAMBLE_INTERVAL_MS = 200;
    export const SCRAMBLE_INTERVAL_STEP_MS = 5;

    export const STARTING_GLYPH_SET: (typeof GLYPH_SETS)[number] = GLYPH_SETS[0];
    export const STARTING_SETTLE_ORDER: (typeof SETTLE_ORDERS)[number] = SETTLE_ORDERS[0];

    export const SETTLE_DURATION_MS_TEXT = {
        label: "Settle duration (ms)",
        hint: "How long the text takes to go from all scrambled to fully settled. It is off while the visitor has asked for reduced motion.",
        controls: "Sets ScrambleTextProps.settleDurationMs",
    };

    export const SCRAMBLE_INTERVAL_MS_TEXT = {
        label: "Scramble interval (ms)",
        hint: "How often an unsettled character is swapped for another. Shorter intervals make a busier churn.",
        controls: "Sets ScrambleTextProps.scrambleIntervalMs",
    };

    export const GLYPH_SET_TEXT = {
        label: "Glyphs",
        hint: "Which characters the unsettled positions are drawn from. Matched churns a digit among digits and a letter among letters of its own case.",
        controls: "Picks the sample glyph function sent to ScrambleTextProps.computeGlyphs",
    };

    export const SETTLE_ORDER_TEXT = {
        label: "Settle order",
        hint: "The order the characters settle in: left to right, from the middle out, at random, and so on.",
        controls: "Picks the sample weight function sent to ScrambleTextProps.computeCharacterWeights",
    };
}
