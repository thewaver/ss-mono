import type { Accessor, JSX } from "solid-js";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type StaircaseDir = "down" | "up";

export type StaircaseStepDefs = {
    index: number;
    stepCount: number;
    indent: number;
};

export type StaircaseStepState = StaircaseStepDefs & {
    stepIndent: number;
};

export type StaircaseProps<T> = AccessorProps<{
    /** How far one step is set in from the one before it. */
    indent: number;
    /** The space between one step and the next. */
    gap?: number;
    /** Which way the staircase runs. */
    dir?: StaircaseDir;
    /** How far one step is indented, for a run that does not step evenly. */
    computeStepIndent?: (defs: StaircaseStepDefs) => number;
}> & {
    /** The steps, in the order they are shown. */
    steps: MaybeAccessor<T[]>;
    /** Draws one step, and is told where it sits in the run. */
    renderStep: (getStep: Accessor<T>, getState: Accessor<StaircaseStepState>) => JSX.Element;
};
