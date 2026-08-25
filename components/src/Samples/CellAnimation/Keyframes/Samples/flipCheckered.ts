import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { flipHorizontal } from "./flipHorizontal";
import { flipVertical } from "./flipVertical";

export const flipCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenCheckeredCells", animation: flipHorizontal }],
    flipVertical,
);
