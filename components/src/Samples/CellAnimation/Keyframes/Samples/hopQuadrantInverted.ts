import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { hopDown } from "./hopDown";
import { hopLeft } from "./hopLeft";
import { hopRight } from "./hopRight";
import { hopUp } from "./hopUp";
import { zoomIn } from "./zoomIn";

export const hopQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: hopDown },
        { zone: "bottom", animation: hopUp },
        { zone: "left", animation: hopRight },
        { zone: "right", animation: hopLeft },
    ],
    zoomIn,
);
