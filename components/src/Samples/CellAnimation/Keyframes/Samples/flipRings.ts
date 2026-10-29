import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { flipHorizontal } from "./flipHorizontal";
import { flipVertical } from "./flipVertical";

export const flipRings: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_rings", animation: flipHorizontal }],
    flipVertical,
);
