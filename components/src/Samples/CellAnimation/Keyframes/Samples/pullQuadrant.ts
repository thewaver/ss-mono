import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { pullDown } from "./pullDown";
import { pullLeft } from "./pullLeft";
import { pullRight } from "./pullRight";
import { pullUp } from "./pullUp";
import { zoomIn } from "./zoomIn";

export const pullQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: pullUp },
        { zone: "bottom", animation: pullDown },
        { zone: "left", animation: pullLeft },
        { zone: "right", animation: pullRight },
    ],
    zoomIn,
);
