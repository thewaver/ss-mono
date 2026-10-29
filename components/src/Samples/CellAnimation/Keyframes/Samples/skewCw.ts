import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const skewCw: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, skewX: -75, skewY: -75, scaleX: 0, scaleY: 0 },
    { at: 1, skewX: 0, skewY: 0, scaleX: 100, scaleY: 100 },
]);
