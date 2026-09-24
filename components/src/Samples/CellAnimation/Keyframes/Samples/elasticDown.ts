import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const elasticDown: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, originY: 0, opacity: 0, scaleY: 100, translateY: 400 },
    { at: 0.25, opacity: 100 },
    { at: 0.5, scaleY: 400, translateY: 0 },
    { at: 1, originY: 0, scaleY: 100, translateY: 0 },
]);
