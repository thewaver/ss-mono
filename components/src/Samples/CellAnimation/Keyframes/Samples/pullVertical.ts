import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const pullVertical: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, scaleX: 0, scaleY: 100 },
    { at: 1, scaleX: 100, scaleY: 100 },
]);
