import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationWeights,
} from "@thewaver/ss-components";
import type { Index2d } from "@thewaver/ss-utils";

export type ParticleFieldExampleProps = AccessorProps<{
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
    playbackSignal: Signal<boolean>;
}>;
