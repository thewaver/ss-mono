import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { popBottomLeft } from "./popBottomLeft";
import { popBottomRight } from "./popBottomRight";
import { popCenter } from "./popCenter";
import { popTopLeft } from "./popTopLeft";
import { popTopRight } from "./popTopRight";

export const popQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "quadrant1", animation: popBottomLeft },
        { zone: "quadrant2", animation: popBottomRight },
        { zone: "quadrant3", animation: popTopRight },
        { zone: "quadrant4", animation: popTopLeft },
    ],
    popCenter,
);
