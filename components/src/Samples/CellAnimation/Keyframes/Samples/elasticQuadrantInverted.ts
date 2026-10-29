import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { elasticDown } from "./elasticDown";
import { elasticLeft } from "./elasticLeft";
import { elasticRight } from "./elasticRight";
import { elasticUp } from "./elasticUp";
import { zoomIn } from "./zoomIn";

export const elasticQuadrantInverted: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: elasticDown },
        { zone: "bottom", animation: elasticUp },
        { zone: "left", animation: elasticRight },
        { zone: "right", animation: elasticLeft },
    ],
    zoomIn,
);
