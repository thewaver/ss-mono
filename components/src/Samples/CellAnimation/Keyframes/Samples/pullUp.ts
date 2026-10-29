import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const pullUp: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originY: 1, scaleY: 0 },
    { at: 1, originY: 1, scaleY: 100 },
]);
