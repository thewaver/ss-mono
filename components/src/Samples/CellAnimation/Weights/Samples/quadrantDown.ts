import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const quadrantDown: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const signedDist = { col: origin.col - pos.col, row: origin.row - pos.row };

    return (1 + (signedDist.col * signedDist.row) / (maxDist.col * maxDist.row)) * 0.5;
};
