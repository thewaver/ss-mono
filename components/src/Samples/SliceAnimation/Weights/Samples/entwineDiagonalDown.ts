import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const entwineDiagonalDown: WeightFn = (pos, count, origin) => {
    const dist = SliceAnimationWeightUtils.getDiagonalDelta(origin, pos);
    const bandMax = SliceAnimationWeightUtils.getMaxDiagonalDistanceInBand(origin, count, dist);

    return MathUtils.isEven(dist.down) ? 1 - dist.up / bandMax.up : dist.up / bandMax.up;
};
