import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { hopDown } from "./hopDown";
import { hopLeft } from "./hopLeft";
import { hopRight } from "./hopRight";
import { hopUp } from "./hopUp";
import { zoomIn } from "./zoomIn";

export const hopQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: hopUp },
        { zone: "bottom", animation: hopDown },
        { zone: "left", animation: hopLeft },
        { zone: "right", animation: hopRight },
    ],
    zoomIn,
);
