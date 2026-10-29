import { BitwiseUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceMorton: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getRoundedPos(SliceAnimationWeightUtils.getMaxDistance(origin, count));
    const dist = SliceAnimationWeightUtils.getRoundedPos(SliceAnimationWeightUtils.getCellDelta(origin, pos));
    const bits = Math.ceil(Math.log2(Math.max(maxDist.col, maxDist.row, 1) + 1));
    const maxCode = BitwiseUtils.interleave(maxDist.col, maxDist.row, bits);

    if (maxCode <= 0) return 1;

    return 1 - BitwiseUtils.interleave(dist.col, dist.row, bits) / maxCode;
};
