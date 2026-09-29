export type StaircaseDir = "down" | "up";

export type StaircaseStepDefs = {
    index: number;
    stepCount: number;
    indent: number;
};

export type StaircaseStepState = StaircaseStepDefs & {
    stepIndent: number;
};
