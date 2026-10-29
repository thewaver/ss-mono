import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const bounceDefault: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, scaleX: 0, scaleY: 0 },
    { at: 0.25, scaleX: 50, scaleY: 200 },
    { at: 0.5, scaleX: 200, scaleY: 50 },
    { at: 0.75, scaleX: 50, scaleY: 200 },
    { at: 1, scaleX: 100, scaleY: 100 },
]);
