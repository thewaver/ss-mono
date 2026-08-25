import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { pullHorizontal } from "./pullHorizontal";
import { pullVertical } from "./pullVertical";

export const pullCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenCheckeredCells", animation: pullHorizontal }],
    pullVertical,
);
