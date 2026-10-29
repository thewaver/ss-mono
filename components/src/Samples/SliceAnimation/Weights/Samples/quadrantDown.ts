import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const quadrantDown: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const signedDist = { col: origin.col - pos.col, row: origin.row - pos.row };

    return (1 + (signedDist.col * signedDist.row) / (maxDist.col * maxDist.row)) * 0.5;
};
