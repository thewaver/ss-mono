import type { DieShapes } from "@thewaver/ss-components";

export namespace DieKnobs {
    export const MIN_ROLL_DURATION_MS = 0;
    export const MAX_ROLL_DURATION_MS = 4000;
    export const ROLL_DURATION_STEP_MS = 100;
    export const MIN_TUMBLE_COUNT = 0;
    export const MAX_TUMBLE_COUNT = 6;
    export const TUMBLE_COUNT_STEP = 1;

    export const STARTING_SHAPE_KEY: DieShapes.SampleKey = "d20";
}
