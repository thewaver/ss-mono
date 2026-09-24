import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const lineDiagonalUp: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getDiagonalDelta(origin, pos).up /
        CellAnimationWeightUtils.getMaxDiagonalDistance(origin, count).up;
