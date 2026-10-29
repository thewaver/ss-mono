import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { flipHorizontal } from "./flipHorizontal";
import { flipVertical } from "./flipVertical";

export const flipCheckered: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_checkered_cells", animation: flipHorizontal }],
    flipVertical,
);
