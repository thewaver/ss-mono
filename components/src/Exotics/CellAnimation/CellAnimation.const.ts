import type { CellAnimationFinalFrame } from "./CellAnimation.types";

export const CELL_ANIMATION_DEFAULTS = {
    animationDurationMs: 2000,
    animationIterationCount: Infinity,
    animationIterationDelayMs: 1000,
    sizeAnchor: "width",
    finalFrame: "cells" as CellAnimationFinalFrame,
};
