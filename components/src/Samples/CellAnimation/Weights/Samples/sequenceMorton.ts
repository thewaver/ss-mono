import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const sequenceMorton: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getRoundedPos(CellAnimationWeightUtils.getMaxDistance(origin, count));
    const dist = CellAnimationWeightUtils.getRoundedPos(CellAnimationWeightUtils.getCellDelta(origin, pos));
    const bits = Math.ceil(Math.log2(Math.max(maxDist.col, maxDist.row, 1) + 1));
    const maxCode = CellAnimationWeightUtils.interleaveBits(maxDist.col, maxDist.row, bits);

    if (maxCode <= 0) return 1;

    return 1 - CellAnimationWeightUtils.interleaveBits(dist.col, dist.row, bits) / maxCode;
};
