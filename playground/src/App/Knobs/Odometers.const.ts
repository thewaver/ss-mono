import type { OdometerReels } from "@thewaver/ss-components";

export namespace OdometerKnobs {
    export const STARTING_VALUE = 199;
    export const MIN_VALUE = -999999;
    export const MAX_VALUE = 999999;
    export const MIN_TURN_MS = 50;
    export const MAX_TURN_MS = 3000;
    export const TURN_STEP_MS = 50;
    export const MIN_CASCADE_MS = 0;
    export const MAX_CASCADE_MS = 500;
    export const CASCADE_STEP_MS = 10;
    export const STARTING_REEL_KEY: OdometerReels.SampleKey = "leftToRight";
}
