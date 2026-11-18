import { ScrambleTextWeights } from "@thewaver/ss-components";

import type { TypewriterTextEffect } from "../Pages/TypewriterPage/TypewriterTextEffect.types";

export namespace TypewriterKnobs {
    export const ARRIVAL_ORDERS = ["left_to_right", ...ScrambleTextWeights.SAMPLE_KEYS] as const;

    export const STARTING_WIDTH = 240;
    export const STARTING_TEXT_EFFECT: TypewriterTextEffect = "fade";
    export const STARTING_ARRIVAL_ORDER: (typeof ARRIVAL_ORDERS)[number] = ARRIVAL_ORDERS[0];
    export const MIN_CONTAINER_WIDTH = 40;
    export const MAX_CONTAINER_WIDTH = 560;
    export const CONTAINER_WIDTH_STEP = 4;

    export const TEXT_EFFECT_TEXT = {
        label: "Effect",
        hint: "How each character arrives: plainly, or with one of the entrance effects.",
        controls: "Picks the example keyframes sent to TypewriterProps.computeAnimationName",
    };

    export const ARRIVAL_ORDER_TEXT = {
        label: "Arrival order",
        hint: "The order the characters arrive in: left to right, from the middle out, scattered, and so on. Erasing runs it backwards. The caret is meant for left to right, and jumps about under the others.",
        controls: "Picks the sample weight function sent to TypewriterProps.computeCharacterWeights",
    };
}
