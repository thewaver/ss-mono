import type { Index2d } from "@thewaver/ss-utils";

import { SLICE_ANIMATION_DEFAULTS } from "../../../Abstracts/SliceAnimation/SliceAnimation.const";

export const PARTICLE_FIELD_DEFAULTS = {
    spawnChance: 1,
    animationDurationMs: 2000,
    animationIterationCount: Infinity,
    animationIterationDelayMs: 0,
    particleLifetimeMs: 600,
    origin: { row: 0, col: 0 } as Index2d,
    renderer: SLICE_ANIMATION_DEFAULTS.renderer,
};
