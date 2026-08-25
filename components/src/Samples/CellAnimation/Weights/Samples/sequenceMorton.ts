import { Point2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const sequenceMorton: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getRoundedPos(CellAnimationWeightUtils.getMaxDistance(origin, count));
    const dist = CellAnimationWeightUtils.getRoundedPos(Point2dUtils.getDelta(origin, pos));
    const bits = Math.ceil(Math.log2(Math.max(maxDist.x, maxDist.y, 1) + 1));
    const maxCode = CellAnimationWeightUtils.interleaveBits(maxDist.x, maxDist.y, bits);

    if (maxCode <= 0) return 1;

    return 1 - CellAnimationWeightUtils.interleaveBits(dist.x, dist.y, bits) / maxCode;
};
