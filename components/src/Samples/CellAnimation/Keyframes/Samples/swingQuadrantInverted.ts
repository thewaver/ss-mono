import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { swingBottom } from "./swingBottom";
import { swingLeft } from "./swingLeft";
import { swingRight } from "./swingRight";
import { swingTop } from "./swingTop";
import { zoomIn } from "./zoomIn";

export const swingQuadrantInverted: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: swingBottom },
        { zone: "bottom", animation: swingTop },
        { zone: "left", animation: swingRight },
        { zone: "right", animation: swingLeft },
    ],
    zoomIn,
);
