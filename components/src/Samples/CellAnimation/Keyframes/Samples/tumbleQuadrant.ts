import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { tumbleDown } from "./tumbleDown";
import { tumbleLeft } from "./tumbleLeft";
import { tumbleRight } from "./tumbleRight";
import { tumbleUp } from "./tumbleUp";
import { zoomIn } from "./zoomIn";

export const tumbleQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: tumbleUp },
        { zone: "bottom", animation: tumbleDown },
        { zone: "left", animation: tumbleLeft },
        { zone: "right", animation: tumbleRight },
    ],
    zoomIn,
);
