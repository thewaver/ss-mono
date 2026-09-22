import type { SweepDefs, WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 1,
    clockDownMul: 1,
    clockRightMul: 1,
    clockUpMul: 1,
    clockLeftMul: 1,
};

export const spiralQuad: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.spiral(pos, count, origin, SWEEP_DEFS);
