import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const rollDiagonalUpConvergent: WeightFn = (pos, count, origin) => {
    const dist = SliceAnimationWeightUtils.getDiagonalDelta(origin, pos);
    const bandMax = SliceAnimationWeightUtils.getMaxDiagonalDistanceInBand(origin, count, dist);

    return MathUtils.isEven(dist.up) ? 1 - dist.down / (bandMax.down * 2) : dist.down / (bandMax.down * 2);
};
