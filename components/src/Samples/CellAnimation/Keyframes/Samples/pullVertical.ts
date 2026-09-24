import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const pullVertical: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, scaleX: 0, scaleY: 100 },
    { at: 1, scaleX: 100, scaleY: 100 },
]);
