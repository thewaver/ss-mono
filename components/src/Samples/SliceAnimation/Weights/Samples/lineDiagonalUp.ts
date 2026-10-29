import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const lineDiagonalUp: WeightFn = (pos, count, origin) =>
    1 -
    SliceAnimationWeightUtils.getDiagonalDelta(origin, pos).up /
        SliceAnimationWeightUtils.getMaxDiagonalDistance(origin, count).up;
