import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { shootDown } from "./shootDown";
import { shootLeft } from "./shootLeft";
import { shootRight } from "./shootRight";
import { shootUp } from "./shootUp";
import { zoomIn } from "./zoomIn";

export const shootQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: shootUp },
        { zone: "bottom", animation: shootDown },
        { zone: "left", animation: shootLeft },
        { zone: "right", animation: shootRight },
    ],
    zoomIn,
);
