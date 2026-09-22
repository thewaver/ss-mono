import type { SweepDefs, WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 2,
    clockDownMul: 0,
    clockRightMul: 1,
    clockUpMul: 0,
    clockLeftMul: 1,
};

export const radarDouble: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(pos, count, origin, SWEEP_DEFS);
