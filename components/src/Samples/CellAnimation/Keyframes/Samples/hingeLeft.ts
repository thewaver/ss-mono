import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const hingeLeft: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 0, opacity: 0, rotateY: -90 },
    { at: 0.25, opacity: 100 },
    { at: 0.75, rotateY: 45 },
    { at: 1, originX: 0, rotateY: 0 },
]);
