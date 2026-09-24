import type { SweepDefs, WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 4,
    clockDownMul: 0,
    clockRightMul: 1,
    clockUpMul: 2,
    clockLeftMul: 3,
};

export const radarSingleCw: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(CellAnimationWeightUtils.getMirroredPos(pos, origin), count, origin, SWEEP_DEFS);
