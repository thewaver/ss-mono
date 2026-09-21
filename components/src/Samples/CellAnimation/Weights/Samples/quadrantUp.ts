import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const quadrantUp: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const signedDist = { col: origin.col - pos.col, row: origin.row - pos.row };

    return (1 - (signedDist.col * signedDist.row) / (maxDist.col * maxDist.row)) * 0.5;
};
