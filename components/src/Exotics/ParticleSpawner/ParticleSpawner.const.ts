import type { ParticleSpawnIterationPattern } from "./ParticleSpawner.types";

export const PARTICLE_SPAWNER_DEFAULTS = {
    travelDurationMs: 1000,
    retentionMs: 0,
    spawnDelayMs: 100,
    spawnIterationPatterns: [{ count: 1 }] as ParticleSpawnIterationPattern[],
};
