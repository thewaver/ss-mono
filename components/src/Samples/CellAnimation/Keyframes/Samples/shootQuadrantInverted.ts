import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { shootDown } from "./shootDown";
import { shootLeft } from "./shootLeft";
import { shootRight } from "./shootRight";
import { shootUp } from "./shootUp";
import { zoomIn } from "./zoomIn";

export const shootQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: shootDown },
        { zone: "bottom", animation: shootUp },
        { zone: "left", animation: shootRight },
        { zone: "right", animation: shootLeft },
    ],
    zoomIn,
);
