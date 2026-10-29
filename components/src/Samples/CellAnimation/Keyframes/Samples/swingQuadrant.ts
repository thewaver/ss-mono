import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { swingBottom } from "./swingBottom";
import { swingLeft } from "./swingLeft";
import { swingRight } from "./swingRight";
import { swingTop } from "./swingTop";
import { zoomIn } from "./zoomIn";

export const swingQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: swingTop },
        { zone: "bottom", animation: swingBottom },
        { zone: "left", animation: swingLeft },
        { zone: "right", animation: swingRight },
    ],
    zoomIn,
);
