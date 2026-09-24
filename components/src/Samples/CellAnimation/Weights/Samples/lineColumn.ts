import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const lineColumn: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getCellDelta(origin, pos).col / CellAnimationWeightUtils.getMaxDistance(origin, count).col;
