import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { popBottomLeft } from "./popBottomLeft";
import { popBottomRight } from "./popBottomRight";
import { popCenter } from "./popCenter";
import { popTopLeft } from "./popTopLeft";
import { popTopRight } from "./popTopRight";

export const popQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "quadrant1", animation: popTopRight },
        { zone: "quadrant2", animation: popTopLeft },
        { zone: "quadrant3", animation: popBottomLeft },
        { zone: "quadrant4", animation: popBottomRight },
    ],
    popCenter,
);
