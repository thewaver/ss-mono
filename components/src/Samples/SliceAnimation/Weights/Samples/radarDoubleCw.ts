import type { SweepDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 2,
    clockDownMul: 0,
    clockRightMul: 1,
    clockUpMul: 0,
    clockLeftMul: 1,
};

export const radarDoubleCw: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.radar(SliceAnimationWeightUtils.getMirroredPos(pos, origin), count, origin, SWEEP_DEFS);
