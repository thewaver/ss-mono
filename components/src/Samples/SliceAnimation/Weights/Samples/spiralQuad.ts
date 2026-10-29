import type { SweepDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 1,
    clockDownMul: 1,
    clockRightMul: 1,
    clockUpMul: 1,
    clockLeftMul: 1,
};

export const spiralQuad: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.spiral(pos, count, origin, SWEEP_DEFS);
