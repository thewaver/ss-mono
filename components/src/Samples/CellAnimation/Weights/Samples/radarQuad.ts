import type { SweepDefs, WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

const SWEEP_DEFS: SweepDefs = {
    quadrantsPerSection: 1,
    clockDownMul: 0,
    clockRightMul: 0,
    clockUpMul: 0,
    clockLeftMul: 0,
};

export const radarQuad: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.radar(pos, count, origin, SWEEP_DEFS);
