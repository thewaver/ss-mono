import type { SliceAnimationFn } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import type {
    SliceAnimationEvaluationDefs,
    SliceAnimationEvaluationResult,
} from "../CellAnimation/CellAnimation.types";

export type ScanlineAnimationOrientation = "horizontal" | "vertical";

export type ScanlineAnimationEvaluationDefs = SliceAnimationEvaluationDefs;

export type ScanlineAnimationEvaluationResult = SliceAnimationEvaluationResult;

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
    /**
     * The sample each line plays over its own turn, from `0` as its turn starts to `1` as it ends, handed the line and
     * the grid. A sample built by `SliceAnimationKeyframeUtils` — every one in `ScanlineAnimationKeyframes` — can be
     * drawn on the graphics card; one written by hand plays on page elements.
     */
    computeSliceAnimation: SliceAnimationFn;
};

export type BaseScanlineAnimationProps = BaseScanlineAnimationValues & BaseScanlineAnimationCbs;
