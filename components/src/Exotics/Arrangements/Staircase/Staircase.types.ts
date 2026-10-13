export type StaircaseDir = "down" | "up";

export type StaircaseStepDefs = {
    index: number;
    stepCount: number;
    indent: number;
};

export type StaircaseStepState = StaircaseStepDefs & {
    stepIndent: number;
};

export type BaseStaircaseValues<T> = {
    /** How far one step is set in from the one before it. */
    indent: number;
    /** The space between one step and the next. */
    gap?: number;
    /** Which way the staircase runs. */
    dir?: StaircaseDir;
    /** The steps, in the order they are shown. */
    steps: T[];
};

export type BaseStaircaseCbs = {
    /** How far one step is indented, for a run that does not step evenly. */
    computeStepIndent?: (defs: StaircaseStepDefs) => number;
};

export type BaseStaircaseProps<T> = BaseStaircaseValues<T> & BaseStaircaseCbs;
