import type { SweepDefs, WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 4,
    clockDownMul: 0,
    clockRightMul: 1,
    clockUpMul: 2,
    clockLeftMul: 3,
};

export const radarSingle: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(pos, count, origin, SWEEP_DEFS);
