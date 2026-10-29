import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const pullLeft: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 1, scaleX: 0 },
    { at: 1, originX: 1, scaleX: 100 },
]);
