import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { elasticDown } from "./elasticDown";
import { elasticLeft } from "./elasticLeft";
import { elasticRight } from "./elasticRight";
import { elasticUp } from "./elasticUp";
import { zoomIn } from "./zoomIn";

export const elasticQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: elasticUp },
        { zone: "bottom", animation: elasticDown },
        { zone: "left", animation: elasticLeft },
        { zone: "right", animation: elasticRight },
    ],
    zoomIn,
);
