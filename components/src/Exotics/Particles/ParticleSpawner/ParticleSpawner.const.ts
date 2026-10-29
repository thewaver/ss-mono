import { SLICE_ANIMATION_DEFAULTS } from "../../../Abstracts/SliceAnimation/SliceAnimation.const";
import type { ParticleSpawnIterationPattern } from "./ParticleSpawner.types";

export const PARTICLE_SPAWNER_DEFAULTS = {
    travelDurationMs: 1000,
    restDurationMs: 0,
    spawnDelayMs: 100,
    spawnIterationPatterns: [{ count: 1 }] as ParticleSpawnIterationPattern[],
    renderer: SLICE_ANIMATION_DEFAULTS.renderer,
};
