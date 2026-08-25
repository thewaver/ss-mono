import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const radarQuadCw: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(CellAnimationWeightUtils.getMirroredPos(pos, origin), count, origin, 1, 0, 0, 0, 0);
