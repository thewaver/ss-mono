import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { cubeBottom } from "./cubeBottom";
import { cubeLeft } from "./cubeLeft";
import { cubeRight } from "./cubeRight";
import { cubeTop } from "./cubeTop";
import { zoomIn } from "./zoomIn";

export const cubeQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: cubeTop },
        { zone: "bottom", animation: cubeBottom },
        { zone: "left", animation: cubeLeft },
        { zone: "right", animation: cubeRight },
    ],
    zoomIn,
);
