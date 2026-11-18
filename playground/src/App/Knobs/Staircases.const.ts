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

    export const STEP_COUNT_TEXT = {
        label: "Steps",
        hint: "How many steps the staircase holds.",
        controls: "Sets the length of the slice of example steps sent to StaircaseProps.steps",
    };

    export const INDENT_TEXT = {
        label: "Indent (px)",
        hint: "How far one step is set in from the one before it.",
        controls: "Sets StaircaseProps.indent",
    };

    export const GAP_TEXT = {
        label: "Gap (px)",
        hint: "The space between one step and the next.",
        controls: "Sets StaircaseProps.gap",
    };

    export const DIR_TEXT = {
        label: "Direction",
        hint: "Which way the staircase runs.",
        controls: "Sets StaircaseProps.dir",
    };

    export const INDENT_KEY_TEXT = {
        label: "Indent function",
        hint: "How the indent grows down the run: evenly, faster and faster, or in and out again.",
        controls: "Picks the sample indent function sent to StaircaseProps.computeStepIndent",
    };
}
