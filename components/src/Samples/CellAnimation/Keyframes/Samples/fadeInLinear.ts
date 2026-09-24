import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const fadeInLinear: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0 },
    { at: 1, opacity: 100 },
]);
