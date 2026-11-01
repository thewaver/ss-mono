import type { Signal } from "solid-js";

import type {
    AccessorProps,
    ParticleSpawnIterationPattern,
    ParticleTravelPathFn,
    SignalSource,
    SliceAnimationRenderer,
} from "@thewaver/ss-components-solid";

export type { ParticleTravelKnobs } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type ParticleSpawnerExampleProps = AccessorProps<{
    particleCount: number;
    travelDurationMs: number;
    restDurationMs: number;
    spawnDelayMs: number;
    spawnIterationPatterns: ParticleSpawnIterationPattern[];
    computeParticlePos: ParticleTravelPathFn;
    areTargetsHidden: boolean;
    playback: SignalSource<boolean>;
    progress?: Signal<number>;
    takeProgress?: () => Signal<number>;
    renderer?: SliceAnimationRenderer;
}>;

export type WindExampleProps = ParticleSpawnerExampleProps &
    AccessorProps<{
        windDirectionDegrees: number;
        windStrengthPixels: number;
        windGustRatio: number;
    }>;

export type AttractionExampleProps = ParticleSpawnerExampleProps &
    AccessorProps<{
        attractionStrengthRatio: number;
        attractionReachPixels: number;
    }>;
