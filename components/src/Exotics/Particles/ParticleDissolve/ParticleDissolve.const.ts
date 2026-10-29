import { SLICE_ANIMATION_DEFAULTS } from "../../../Abstracts/SliceAnimation/SliceAnimation.const";

export const PARTICLE_DISSOLVE_DEFAULTS = {
    angleDegrees: 90,
    durationMs: 1200,
    particleLifetimeMs: 600,
    featherShare: 0.2,
    spawnChance: 0.5,
    cellSize: 8,
    renderer: SLICE_ANIMATION_DEFAULTS.renderer,
};
