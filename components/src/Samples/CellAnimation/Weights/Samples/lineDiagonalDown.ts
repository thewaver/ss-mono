import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const lineDiagonalDown: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getDiagonalDelta(origin, pos).down /
        CellAnimationWeightUtils.getMaxDiagonalDistance(origin, count).down;
