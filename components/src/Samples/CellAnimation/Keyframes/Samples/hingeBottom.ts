import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const hingeBottom: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originY: 1, opacity: 0, rotateX: -90 },
    { at: 0.25, opacity: 100 },
    { at: 0.75, rotateX: 45 },
    { at: 1, originY: 1, rotateX: 0 },
]);
