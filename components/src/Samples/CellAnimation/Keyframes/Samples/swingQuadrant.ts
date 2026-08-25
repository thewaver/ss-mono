import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { swingBottom } from "./swingBottom";
import { swingLeft } from "./swingLeft";
import { swingRight } from "./swingRight";
import { swingTop } from "./swingTop";
import { zoomIn } from "./zoomIn";

export const swingQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: swingTop },
        { zone: "bottom", animation: swingBottom },
        { zone: "left", animation: swingLeft },
        { zone: "right", animation: swingRight },
    ],
    zoomIn,
);
