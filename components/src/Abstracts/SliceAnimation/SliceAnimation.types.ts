import type { Index2d } from "@thewaver/ss-utils";

import type { SliceAnimationEvaluationDefs } from "../../Exotics/Animations/CellAnimation/CellAnimation.types";
import type { SliceAnimationBreakpointOpts } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.types";
import type { SliceStop } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";

export type SliceAnimationRenderer = "graphics_card" | "elements";

export type SliceAnimationSlice = SliceAnimationEvaluationDefs & { origin: Index2d };

export type SliceAnimationTiming = {
    globalTimeline: number;
    breakpointOpts: SliceAnimationBreakpointOpts;
};

export type SliceAnimationWindow = {
    half: number;
    isDescending: boolean;
};

export type SliceAnimationTables = {
    tables: SliceStop[][];
    tableIndices: number[];
};

export type SliceAnimationPassDefs = {
    getProgress: () => number;
    setProgress: (progress: number) => void;
    getCurrentIteration: () => number;
    setCurrentIteration: (iteration: number) => void;
    getDurationMs: () => number;
    getIterationCount: () => number;
    getIterationDelayMs: () => number;
    onIterationEnd?: () => void;
    onAnimationEnd?: () => void;
};
