import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const lineRow: WeightFn = (pos, count, origin) =>
    1 -
    CellAnimationWeightUtils.getCellDelta(origin, pos).row / CellAnimationWeightUtils.getMaxDistance(origin, count).row;
