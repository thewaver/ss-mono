import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const radarSingleCw: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(CellAnimationWeightUtils.getMirroredPos(pos, origin), count, origin, 4, 0, 1, 2, 3);
