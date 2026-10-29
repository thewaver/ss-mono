import type { SweepDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 1,
    clockDownMul: 0,
    clockRightMul: 0,
    clockUpMul: 0,
    clockLeftMul: 0,
};

export const radarQuad: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.radar(pos, count, origin, SWEEP_DEFS);
