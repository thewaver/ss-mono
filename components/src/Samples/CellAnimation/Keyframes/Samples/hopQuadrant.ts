import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { hopDown } from "./hopDown";
import { hopLeft } from "./hopLeft";
import { hopRight } from "./hopRight";
import { hopUp } from "./hopUp";
import { zoomIn } from "./zoomIn";

export const hopQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: hopUp },
        { zone: "bottom", animation: hopDown },
        { zone: "left", animation: hopLeft },
        { zone: "right", animation: hopRight },
    ],
    zoomIn,
);
