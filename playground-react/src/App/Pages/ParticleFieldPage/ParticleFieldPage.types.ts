import type { CellAnimationKeyframes, CellAnimationOrigins, CellAnimationWeights } from "@thewaver/ss-components-react";
import type { Index2d } from "@thewaver/ss-utils";

export type ParticleFieldExampleProps = {
    cellCount: Index2d;
    spawnChance: number;
    animationIterationDelayMs: number;
    animationDurationMs: number;
    particleLifetimeMs: number;
    originType: CellAnimationOrigins.OriginType;
    weightType: CellAnimationWeights.WeightType;
    animationType: CellAnimationKeyframes.AnimationType;
    holdShare: number;
    isScattered: boolean;
    playback: readonly [boolean, (value: boolean) => void];
};
