import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
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
