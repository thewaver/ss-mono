import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const lineDiagonalUpAlternate: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDiagonalDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getDiagonalDelta(origin, pos);

    return MathUtils.isEven(dist.up) ? 1 - dist.up / (maxDist.up * 2) : 1 - (dist.up / (maxDist.up * 2) + 0.5);
};
