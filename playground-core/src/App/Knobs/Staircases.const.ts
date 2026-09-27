import type { StaircaseIndents } from "@thewaver/ss-components";

export namespace StaircaseKnobs {
    export const MIN_STEP_COUNT = 1;
    export const MAX_STEP_COUNT = 10;
    export const STEP_COUNT_STEP = 1;
    export const MIN_INDENT = 0;
    export const MAX_INDENT = 60;
    export const INDENT_STEP = 2;
    export const MIN_GAP = 0;
    export const MAX_GAP = 40;
    export const GAP_STEP = 2;

    export const STARTING_STEP_COUNT = 6;
    export const STARTING_INDENT = 12;
    export const STARTING_INDENT_KEY: StaircaseIndents.SampleKey = "linear";
}
