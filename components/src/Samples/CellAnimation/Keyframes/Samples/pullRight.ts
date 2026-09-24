import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const pullRight: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 0, scaleX: 0 },
    { at: 1, originX: 0, scaleX: 100 },
]);
