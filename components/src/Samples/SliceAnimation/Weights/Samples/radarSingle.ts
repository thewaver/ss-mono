import type { SweepDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 4,
    clockDownMul: 0,
    clockRightMul: 1,
    clockUpMul: 2,
    clockLeftMul: 3,
};

export const radarSingle: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.radar(pos, count, origin, SWEEP_DEFS);
