import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { rollDownLeft } from "./rollDownLeft";
import { rollDownRight } from "./rollDownRight";
import { rollUpLeft } from "./rollUpLeft";
import { rollUpRight } from "./rollUpRight";
import { zoomIn } from "./zoomIn";

export const rollQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "quadrant1", animation: rollDownLeft },
        { zone: "quadrant2", animation: rollDownRight },
        { zone: "quadrant3", animation: rollUpRight },
        { zone: "quadrant4", animation: rollUpLeft },
        { zone: "axis1", animation: rollDownLeft },
        { zone: "axis3", animation: rollUpLeft },
        { zone: "axis4", animation: rollUpRight },
        { zone: "axis2", animation: rollDownRight },
    ],
    zoomIn,
);
