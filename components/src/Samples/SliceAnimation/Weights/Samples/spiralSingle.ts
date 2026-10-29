import type { SweepDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 4,
    clockDownMul: 1,
    clockRightMul: 3,
    clockUpMul: 5,
    clockLeftMul: 7,
};

export const spiralSingle: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.spiral(pos, count, origin, SWEEP_DEFS);
