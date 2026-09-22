import type { SweepDefs, WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 2,
    clockDownMul: 1,
    clockRightMul: 3,
    clockUpMul: 1,
    clockLeftMul: 3,
};

export const spiralDouble: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.spiral(pos, count, origin, SWEEP_DEFS);
