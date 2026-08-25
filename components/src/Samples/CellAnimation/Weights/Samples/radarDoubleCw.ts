import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const radarDoubleCw: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(CellAnimationWeightUtils.getMirroredPos(pos, origin), count, origin, 2, 0, 1, 0, 1);
