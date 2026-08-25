import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { flipHorizontal } from "./flipHorizontal";
import { flipVertical } from "./flipVertical";

export const flipRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: flipHorizontal }],
    flipVertical,
);
