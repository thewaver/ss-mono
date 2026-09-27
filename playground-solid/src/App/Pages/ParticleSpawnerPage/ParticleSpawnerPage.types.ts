import type { Signal } from "solid-js";

import type { AccessorProps, ParticleSpawnIterationPattern } from "@thewaver/ss-components-solid";
import type { ParticleTravelPatternFn } from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type {
    IterationPattern,
    IterationPatternFn,
    ParticleTravelKnobs,
    ParticleTravelPattern,
    ParticleTravelPatternFactory,
    ParticleTravelPatternFn,
    TravelEasingKey,
} from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type ParticleSpawnerExampleProps = AccessorProps<{
    particleCount: number;
    travelDurationMs: number;
    retentionMs: number;
    spawnDelayMs: number;
    spawnIterationPatterns: ParticleSpawnIterationPattern[];
    computeParticlePos: ParticleTravelPatternFn;
    areTargetsHidden: boolean;
    playbackSignal: Signal<boolean>;
}>;
