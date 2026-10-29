import type { CellAnimationEvaluationDefs, CellAnimationEvaluationResult } from "../CellAnimation/CellAnimation.types";

export type ScanlineAnimationOrientation = "horizontal" | "vertical";

export type ScanlineAnimationEvaluationDefs = CellAnimationEvaluationDefs;

export type ScanlineAnimationEvaluationResult = CellAnimationEvaluationResult;

export type BaseScanlineAnimationValues = {
    /** How many lines the picture is cut into. More lines is a finer sweep and more work per frame. */
    lineCount: number;
    /**
     * Which way the lines run. `horizontal` cuts the picture into rows, `vertical` into columns. A line's place is
     * read off `defs.pos.row` for rows and `defs.pos.col` for columns, since the defs are the grid's own.
     */
    orientation?: ScanlineAnimationOrientation;
};

export type BaseScanlineAnimationCbs = {
    /** What one line does on its turn, given where it is and how far through the pass it is. */
    computeSliceAnimation: (
        defs: ScanlineAnimationEvaluationDefs,
        timeline: number,
    ) => ScanlineAnimationEvaluationResult;
};

export type BaseScanlineAnimationProps = BaseScanlineAnimationValues & BaseScanlineAnimationCbs;
