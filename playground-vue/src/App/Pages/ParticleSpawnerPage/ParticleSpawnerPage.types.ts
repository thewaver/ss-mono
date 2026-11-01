import type { Ref } from "vue";

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
    "progress"?: number;
    "onUpdate:progress"?: (value: number) => void;
    "takeProgress"?: () => Ref<number>;
    "renderer"?: SliceAnimationRenderer;
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
