import type { DieShapes } from "@thewaver/ss-components";

export namespace DieKnobs {
    export const MIN_ROLL_DURATION_MS = 0;
    export const MAX_ROLL_DURATION_MS = 4000;
    export const ROLL_DURATION_STEP_MS = 100;
    export const MIN_TUMBLE_COUNT = 0;
    export const MAX_TUMBLE_COUNT = 6;
    export const TUMBLE_COUNT_STEP = 1;

    export const STARTING_SHAPE_KEY: DieShapes.SampleKey = "d20";

    export const SHAPE_TEXT = {
        label: "Die",
        hint: "Which solid the tabletop die and the icon cloud are, from four faces to a hundred. The planet keeps twelve.",
        controls: "Picks the sample shape sent to DieProps.shape",
    };

    export const ROLL_DURATION_MS_TEXT = {
        label: "Roll duration (ms)",
        hint: "How long a roll takes to land. It is off while the visitor has asked for reduced motion.",
        controls: "Sets DieProps.rollDurationMs",
    };

    export const TUMBLE_COUNT_TEXT = {
        label: "Tumbles",
        hint: "How many whole turns a roll makes on its way.",
        controls: "Sets DieProps.tumbleCount",
    };
}
