import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { carouselBottom } from "./carouselBottom";
import { carouselLeft } from "./carouselLeft";
import { carouselRight } from "./carouselRight";
import { carouselTop } from "./carouselTop";
import { zoomIn } from "./zoomIn";

export const carouselQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: carouselBottom },
        { zone: "bottom", animation: carouselTop },
        { zone: "left", animation: carouselRight },
        { zone: "right", animation: carouselLeft },
    ],
    zoomIn,
);
