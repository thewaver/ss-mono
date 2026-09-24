import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const pullHorizontal: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, scaleX: 100, scaleY: 0 },
    { at: 1, scaleX: 100, scaleY: 100 },
]);
