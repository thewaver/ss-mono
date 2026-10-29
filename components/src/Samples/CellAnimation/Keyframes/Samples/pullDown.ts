import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const pullDown: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originY: 0, scaleY: 0 },
    { at: 1, originY: 0, scaleY: 100 },
]);
