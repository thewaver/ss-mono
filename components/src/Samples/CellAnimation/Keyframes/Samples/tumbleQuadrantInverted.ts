import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { tumbleDown } from "./tumbleDown";
import { tumbleLeft } from "./tumbleLeft";
import { tumbleRight } from "./tumbleRight";
import { tumbleUp } from "./tumbleUp";
import { zoomIn } from "./zoomIn";

export const tumbleQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: tumbleDown },
        { zone: "bottom", animation: tumbleUp },
        { zone: "left", animation: tumbleRight },
        { zone: "right", animation: tumbleLeft },
    ],
    zoomIn,
);
