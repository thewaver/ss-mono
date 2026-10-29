import type { CellAnimationKeyframes, CellAnimationOrigins, SliceAnimationWeights } from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

export type ParticleFieldExampleProps = {
    "cellCount": Index2d;
    "spawnChance": number;
    "animationIterationDelayMs": number;
    "animationDurationMs": number;
    "particleLifetimeMs": number;
    "originType": CellAnimationOrigins.OriginType;
    "weightType": SliceAnimationWeights.WeightType;
    "animationType": CellAnimationKeyframes.AnimationType;
    "holdShare": number;
    "isScattered": boolean;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
};
