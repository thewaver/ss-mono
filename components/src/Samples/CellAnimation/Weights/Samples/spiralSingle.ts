import type { SweepDefs, WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 4,
    clockDownMul: 1,
    clockRightMul: 3,
    clockUpMul: 5,
    clockLeftMul: 7,
};

export const spiralSingle: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.spiral(pos, count, origin, SWEEP_DEFS);
