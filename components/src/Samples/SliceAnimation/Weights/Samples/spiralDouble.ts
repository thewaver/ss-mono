import type { SweepDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 2,
    clockDownMul: 1,
    clockRightMul: 3,
    clockUpMul: 1,
    clockLeftMul: 3,
};

export const spiralDouble: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.spiral(pos, count, origin, SWEEP_DEFS);
