import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const popTopLeft: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 0, originY: 0, scaleX: 0, scaleY: 0 },
    { at: 0.5, scaleX: 100, scaleY: 100, brightness: 80 },
    { at: 0.75, scaleX: 150, scaleY: 150 },
    { at: 1, originX: 0, originY: 0, scaleX: 100, scaleY: 100 },
]);
