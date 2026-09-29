import type { Snippet } from "svelte";
import type { StaircaseDir, StaircaseStepDefs, StaircaseStepState } from "@thewaver/ss-components";
export type StaircaseProps<T> = {
    /** How far one step is set in from the one before it. */
    indent: number;
    /** The space between one step and the next. */
    gap?: number;
    /** Which way the staircase runs. */
    dir?: StaircaseDir;
    /** How far one step is indented, for a run that does not step evenly. */
    computeStepIndent?: (defs: StaircaseStepDefs) => number;
    /** The steps, in the order they are shown. */
    steps: T[];
    /** Draws one step, and is told where it sits in the run. */
    renderStep: Snippet<[step: T, state: StaircaseStepState]>;
};
