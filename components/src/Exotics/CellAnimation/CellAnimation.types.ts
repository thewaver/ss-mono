import type { CSSAnimationValues, Index2d, Size2d } from "@thewaver/ss-utils";

export type CellAnimationFinalFrame = "source" | "cells" | "nothing";

export type CellAnimationEvaluationResult = CSSAnimationValues;

export type CellAnimationEvaluationDefs = {
    pos: Index2d;
    count: Index2d;
    weight: number;
    size: Size2d;
};
