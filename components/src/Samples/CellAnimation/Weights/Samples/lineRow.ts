import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const lineRow: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getCellDelta(origin, pos).row / CellAnimationWeightUtils.getMaxDistance(origin, count).row;
