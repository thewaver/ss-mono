import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { pullHorizontal } from "./pullHorizontal";
import { pullVertical } from "./pullVertical";

export const pullRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: pullHorizontal }],
    pullVertical,
);
