import type {
    ParticleSpawnIterationPattern,
    ParticleTravelPathFn,
    SliceAnimationRenderer,
} from "@thewaver/ss-components-react";

export type { ParticleTravelKnobs } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type ParticleSpawnerExampleProps = {
    particleCount: number;
    travelDurationMs: number;
    restDurationMs: number;
    spawnDelayMs: number;
    spawnIterationPatterns: ParticleSpawnIterationPattern[];
    computeParticlePos: ParticleTravelPathFn;
    areTargetsHidden: boolean;
    playback: readonly [boolean, (value: boolean) => void];
    progress?: readonly [number, (value: number) => void];
    takeProgress?: (index: number) => readonly [number, (value: number) => void];
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
