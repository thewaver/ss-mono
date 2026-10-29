import type { Index2d } from "@thewaver/ss-utils";

import { SLICE_ANIMATION_DEFAULTS } from "../../../Abstracts/SliceAnimation/SliceAnimation.const";
import type { CellAnimationFinalFrame } from "./CellAnimation.types";

export const CELL_ANIMATION_DEFAULTS = {
    animationDurationMs: 2000,
    animationIterationCount: Infinity,
    animationIterationDelayMs: 1000,
    sizeAnchor: "width",
    finalFrame: "cells" as CellAnimationFinalFrame,
    origin: { row: 0, col: 0 } as Index2d,
    renderer: SLICE_ANIMATION_DEFAULTS.renderer,
};

export const CELL_ANIMATION_FINAL_FRAMES: readonly CellAnimationFinalFrame[] = ["source", "cells", "nothing"];
