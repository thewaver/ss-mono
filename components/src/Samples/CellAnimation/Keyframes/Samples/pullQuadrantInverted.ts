import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { pullDown } from "./pullDown";
import { pullLeft } from "./pullLeft";
import { pullRight } from "./pullRight";
import { pullUp } from "./pullUp";
import { zoomIn } from "./zoomIn";

export const pullQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: pullDown },
        { zone: "bottom", animation: pullUp },
        { zone: "left", animation: pullRight },
        { zone: "right", animation: pullLeft },
    ],
    zoomIn,
);
