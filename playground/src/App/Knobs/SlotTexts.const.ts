import type { SlotTextLetterRoute, SlotTextMechanism, SlotTextReels } from "@thewaver/ss-components";

export namespace SlotTextKnobs {
    export const STARTING_VALUE = 199;
    export const MIN_VALUE = -999999;
    export const MAX_VALUE = 999999;
    export const MIN_TURN_MS = 50;
    export const MAX_TURN_MS = 3000;
    export const TURN_STEP_MS = 50;
    export const MIN_CASCADE_MS = 0;
    export const MAX_CASCADE_MS = 500;
    export const CASCADE_STEP_MS = 10;
    export const STARTING_REEL_KEY: SlotTextReels.SampleKey = "left_to_right";
    export const STARTING_WORD_MECHANISM: SlotTextMechanism = "split_flap";
    export const STARTING_LETTER_ROUTE: SlotTextLetterRoute = "forward";
    export const MECHANISMS: SlotTextMechanism[] = ["drum", "split_flap"];
    export const LETTER_ROUTES: SlotTextLetterRoute[] = ["forward", "shortest"];

    export const REEL_KEY_TEXT = {
        label: "Reel",
        hint: "How many extra turns each column makes and how long it takes, which decides the order the columns stop in.",
        controls: "Picks the sample reel sent to SlotTextProps.computeReel",
    };

    export const MECHANISM_TEXT = {
        label: "Mechanism",
        hint: "Whether each letter turns on a drum or drops through flaps.",
        controls: "Sets SlotTextProps.mechanism",
    };

    export const LETTER_ROUTE_TEXT = {
        label: "Letter route",
        hint: "Forward always goes on round the alphabet, so C to Z passes every letter between; shortest takes the nearer way, so C to Z goes back three.",
        controls: "Sets SlotTextProps.letterRoute",
    };

    export const VALUE_TEXT = {
        label: "Value",
        hint: "The number the counter and the departures board show. Changing it is what starts them turning.",
        controls: "Sets the number the example formats into SlotTextProps.text",
    };

    export const TURN_DURATION_MS_TEXT = {
        label: "Turn (ms)",
        hint: "How long one column takes to turn from its old character to its new one.",
        controls: "Sets SlotTextProps.turnDurationMs",
    };

    export const TURN_DELAY_MS_TEXT = {
        label: "Turn delay (ms)",
        hint: "How long each column waits after the turning column beside it starts, which is what makes the turn ripple along.",
        controls: "Sets SlotTextProps.turnDelayMs",
    };
}
