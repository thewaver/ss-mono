import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { swingBottom } from "./swingBottom";
import { swingLeft } from "./swingLeft";
import { swingRight } from "./swingRight";
import { swingTop } from "./swingTop";
import { zoomIn } from "./zoomIn";

export const swingQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: swingBottom },
        { zone: "bottom", animation: swingTop },
        { zone: "left", animation: swingRight },
        { zone: "right", animation: swingLeft },
    ],
    zoomIn,
);
