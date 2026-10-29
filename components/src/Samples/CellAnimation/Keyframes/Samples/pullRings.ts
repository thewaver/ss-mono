import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { pullHorizontal } from "./pullHorizontal";
import { pullVertical } from "./pullVertical";

export const pullRings: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_rings", animation: pullHorizontal }],
    pullVertical,
);
