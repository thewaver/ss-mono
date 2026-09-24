import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { tumbleDown } from "./tumbleDown";
import { tumbleLeft } from "./tumbleLeft";
import { tumbleRight } from "./tumbleRight";
import { tumbleUp } from "./tumbleUp";
import { zoomIn } from "./zoomIn";

export const tumbleQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: tumbleUp },
        { zone: "bottom", animation: tumbleDown },
        { zone: "left", animation: tumbleLeft },
        { zone: "right", animation: tumbleRight },
    ],
    zoomIn,
);
