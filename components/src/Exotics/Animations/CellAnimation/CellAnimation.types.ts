import type { CSSAnimationValues, Index2d, Size2d } from "@thewaver/ss-utils";

import type { SliceAnimationRenderer } from "../../../Abstracts/SliceAnimation/SliceAnimation.types";
import type { SliceAnimationBreakpointOpts } from "../../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.types";
import type { SliceAnimationFn } from "../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import type { SliceAnimationPlaybackOpts } from "../../../Generators/SliceAnimationPlayback/SliceAnimationPlayback.types";

export type CellAnimationFinalFrame = "source" | "cells" | "nothing";

export type SliceAnimationEvaluationResult = CSSAnimationValues;

export type SliceAnimationEvaluationDefs = {
    pos: Index2d;
    count: Index2d;
    weight: number;
    size: Size2d;
};

export type BaseCellAnimationValues = {
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
    /** What the grid is left showing once the passes are done. */
    finalFrame?: CellAnimationFinalFrame;
    /**
     * The cell a sample measures from — the center its zones and its own geometry take. The weights take theirs
     * through `computeSliceWeights`.
     */
    origin?: Index2d;
    /**
     * How each cell's turn is laid out from its weight: which way the weights run, how much of the pass one cell's
     * turn takes, and the easing within it. At a `smoothness` of `1` every cell's turn is the whole pass.
     */
    breakpointOpts?: SliceAnimationBreakpointOpts;
    /**
     * Which way a pass plays — forwards, backwards, or out and back — and how long a round trip holds at the turn. A
     * round trip makes a pass twice `animationDurationMs` plus the hold.
     */
    playbackOpts?: SliceAnimationPlaybackOpts;
    /**
     * What draws the cells. `"graphics_card"` draws them into one canvas and falls back to page elements by itself
     * wherever it cannot: no WebGL 2, a sample written by hand rather than built by `SliceAnimationKeyframeUtils`, a
     * picture whose server gives no cross-origin permission, or a moment the browser has taken the graphics card away.
     * `"elements"` always draws each cell as an element of its own, which keeps an animated picture playing — the
     * graphics card draws only its first frame.
     */
    renderer?: SliceAnimationRenderer;
};

export type BaseCellAnimationCbs = {
    /**
     * Decides each cell's turn, as a weight per cell. It is what makes a sweep a sweep rather than everything moving at
     * once.
     */
    computeSliceWeights?: (count: Index2d) => number[][];
    /** What the picture as a whole does over the pass, for an effect that is not per cell. */
    computeRootAnimation?: (timeline: number) => SliceAnimationEvaluationResult;
    /**
     * The sample each cell plays over its own turn, from `0` as its turn starts to `1` as it ends, handed the cell and
     * the grid. A sample built by `SliceAnimationKeyframeUtils` — every one in `CellAnimationKeyframes` — can be drawn on
     * the graphics card; one written by hand plays on page elements.
     */
    computeSliceAnimation: SliceAnimationFn;
    /** Runs at the end of each pass. */
    onIterationEnd?: () => void;
    /** Runs once every pass is done. */
    onAnimationEnd?: () => void;
};

export type BaseCellAnimationProps = BaseCellAnimationValues & BaseCellAnimationCbs;
