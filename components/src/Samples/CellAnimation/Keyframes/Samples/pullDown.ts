import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const pullDown: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, originY: 0, scaleY: 0 },
    { at: 1, originY: 0, scaleY: 100 },
]);
