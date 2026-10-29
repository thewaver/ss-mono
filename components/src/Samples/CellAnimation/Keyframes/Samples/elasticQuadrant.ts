import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { elasticDown } from "./elasticDown";
import { elasticLeft } from "./elasticLeft";
import { elasticRight } from "./elasticRight";
import { elasticUp } from "./elasticUp";
import { zoomIn } from "./zoomIn";

export const elasticQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: elasticUp },
        { zone: "bottom", animation: elasticDown },
        { zone: "left", animation: elasticLeft },
        { zone: "right", animation: elasticRight },
    ],
    zoomIn,
);
