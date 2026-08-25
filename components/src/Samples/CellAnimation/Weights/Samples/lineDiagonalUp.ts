import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const lineDiagonalUp: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getDiagonalDelta(origin, pos).up /
        CellAnimationWeightUtils.getMaxDiagonalDistance(origin, count).up;
