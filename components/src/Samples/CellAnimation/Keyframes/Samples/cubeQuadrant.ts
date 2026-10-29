import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { cubeBottom } from "./cubeBottom";
import { cubeLeft } from "./cubeLeft";
import { cubeRight } from "./cubeRight";
import { cubeTop } from "./cubeTop";
import { zoomIn } from "./zoomIn";

export const cubeQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: cubeTop },
        { zone: "bottom", animation: cubeBottom },
        { zone: "left", animation: cubeLeft },
        { zone: "right", animation: cubeRight },
    ],
    zoomIn,
);
