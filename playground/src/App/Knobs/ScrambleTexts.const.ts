import { ScrambleTextGlyphs, ScrambleTextWeights } from "@thewaver/ss-components";

export namespace ScrambleTextKnobs {
    export const GLYPH_SETS = ["library", ...ScrambleTextGlyphs.SAMPLE_KEYS] as const;
    export const SETTLE_ORDERS = ["leftToRight", ...ScrambleTextWeights.SAMPLE_KEYS] as const;

    export const MIN_SETTLE_DURATION_MS = 0;
    export const MAX_SETTLE_DURATION_MS = 4000;
    export const SETTLE_DURATION_STEP_MS = 100;
    export const MIN_SCRAMBLE_INTERVAL_MS = 10;
    export const MAX_SCRAMBLE_INTERVAL_MS = 200;
    export const SCRAMBLE_INTERVAL_STEP_MS = 5;

    export const STARTING_GLYPH_SET: (typeof GLYPH_SETS)[number] = GLYPH_SETS[0];
    export const STARTING_SETTLE_ORDER: (typeof SETTLE_ORDERS)[number] = SETTLE_ORDERS[0];
}
