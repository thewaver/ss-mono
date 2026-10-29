import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { carouselBottom } from "./carouselBottom";
import { carouselLeft } from "./carouselLeft";
import { carouselRight } from "./carouselRight";
import { carouselTop } from "./carouselTop";
import { zoomIn } from "./zoomIn";

export const carouselQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: carouselTop },
        { zone: "bottom", animation: carouselBottom },
        { zone: "left", animation: carouselLeft },
        { zone: "right", animation: carouselRight },
    ],
    zoomIn,
);
