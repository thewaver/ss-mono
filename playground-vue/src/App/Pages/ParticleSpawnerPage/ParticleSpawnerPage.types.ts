import type { ParticleSpawnIterationPattern } from "@thewaver/ss-components-vue";
import type { ParticleTravelPatternFn } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type {
    IterationPattern,
    IterationPatternFn,
    ParticleTravelKnobs,
    ParticleTravelPattern,
    ParticleTravelPatternFactory,
    ParticleTravelPatternFn,
    TravelEasingKey,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type ParticleSpawnerExampleProps = {
    "particleCount": number;
    "travelDurationMs": number;
    "retentionMs": number;
    "spawnDelayMs": number;
    "spawnIterationPatterns": ParticleSpawnIterationPattern[];
    "computeParticlePos": ParticleTravelPatternFn;
    "areTargetsHidden": boolean;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
};
