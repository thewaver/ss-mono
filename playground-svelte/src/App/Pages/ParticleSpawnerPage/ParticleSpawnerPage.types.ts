import type {
    ParticleSpawnIterationPattern,
    ParticleTravelPathFn,
    SliceAnimationRenderer,
} from "@thewaver/ss-components-svelte";

export type { ParticleTravelKnobs } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type ProgressSlot = { value: number };

export type ParticleSpawnerExampleProps = {
    particleCount: number;
    travelDurationMs: number;
    restDurationMs: number;
    spawnDelayMs: number;
    spawnIterationPatterns: ParticleSpawnIterationPattern[];
    computeParticlePos: ParticleTravelPathFn;
    areTargetsHidden: boolean;
    playback: boolean;
    progress?: number;
    takeProgress?: () => ProgressSlot;
    renderer?: SliceAnimationRenderer;
};

export type WindExampleProps = ParticleSpawnerExampleProps & {
    windDirectionDegrees: number;
    windStrengthPixels: number;
    windGustRatio: number;
};

export type AttractionExampleProps = ParticleSpawnerExampleProps & {
    attractionStrengthRatio: number;
    attractionReachPixels: number;
};
