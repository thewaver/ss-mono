import type {
    ParticleSpawnIterationPattern,
    ParticleTravelPathFn,
    SliceAnimationRenderer,
} from "@thewaver/ss-components-vue";

export type { ParticleTravelKnobs } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPatterns.types";

export type ParticleSpawnerExampleProps = {
    "particleCount": number;
    "travelDurationMs": number;
    "restDurationMs": number;
    "spawnDelayMs": number;
    "spawnIterationPatterns": ParticleSpawnIterationPattern[];
    "computeParticlePos": ParticleTravelPathFn;
    "areTargetsHidden": boolean;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
    "renderer"?: SliceAnimationRenderer;
};
