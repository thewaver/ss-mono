import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const lineDiagonalDown: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getDiagonalDelta(origin, pos).down /
        CellAnimationWeightUtils.getMaxDiagonalDistance(origin, count).down;
