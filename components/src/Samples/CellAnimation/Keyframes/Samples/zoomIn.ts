import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const zoomIn: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, scaleX: 0, scaleY: 0 },
    { at: 1, scaleX: 100, scaleY: 100 },
]);
