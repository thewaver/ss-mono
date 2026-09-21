import type { CSSAnimationValues, Index2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type CellAnimationFinalFrame = "source" | "cells" | "nothing";

export type CellAnimationEvaluationResult = CSSAnimationValues;

export type CellAnimationEvaluationDefs = {
    pos: Index2d;
    count: Index2d;
    weight: number;
    size: Size2d;
};

export type CellAnimationProps = AccessorProps<{
    /** The picture the cells are cut from. */
    src: string;
    /** Names the picture for assistive technology. */
    ariaLabel?: string;
    /** Which side the animation takes as given, working the other out from the picture's proportions. */
    sizeAnchor?: "width" | "height";
    /**
     * How many cells the picture is cut into, across and down. More cells is a finer animation and more work per frame.
     */
    cellCount: Index2d;
    /** How long one pass over the whole grid takes. */
    animationDurationMs?: number;
    /** How many passes to run. Left out, it never stops. */
    animationIterationCount?: number;
    /** How long the grid waits between one pass and the next. */
    animationIterationDelayMs?: number;
    /** Whether the animation is running. It is the only thing that starts or pauses it. */
    playbackSignal?: SignalSource<boolean>;
    /** What the grid is left showing once the passes are done. */
    finalFrame?: CellAnimationFinalFrame;
    /**
     * Decides each cell's turn, as a weight per cell. It is what makes a sweep a sweep rather than everything moving at
     * once.
     */
    computeCellWeights?: (count: Index2d) => number[][];
    /** What the picture as a whole does over the pass, for an effect that is not per cell. */
    computeRootAnimation?: (timeline: number) => CellAnimationEvaluationResult;
    /** What one cell does on its turn, given where it is and how far through the pass it is. */
    computeCellAnimation: (defs: CellAnimationEvaluationDefs, timeline: number) => CellAnimationEvaluationResult;
    /** Runs at the end of each pass. */
    onIterationEnd?: () => void;
    /** Runs once every pass is done. */
    onAnimationEnd?: () => void;
}>;
