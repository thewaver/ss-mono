import { ScrambleTextWeights } from "@thewaver/ss-components";

import type { TypewriterTextEffect } from "../Pages/TypewriterPage/TypewriterPage.types";

export namespace TypewriterKnobs {
    export const ARRIVAL_ORDERS = ["leftToRight", ...ScrambleTextWeights.SAMPLE_KEYS] as const;

    export const STARTING_WIDTH = 240;
    export const STARTING_TEXT_EFFECT: TypewriterTextEffect = "fade";
    export const STARTING_ARRIVAL_ORDER: (typeof ARRIVAL_ORDERS)[number] = ARRIVAL_ORDERS[0];
    export const MIN_CONTAINER_WIDTH = 40;
    export const MAX_CONTAINER_WIDTH = 560;
    export const CONTAINER_WIDTH_STEP = 4;
}
