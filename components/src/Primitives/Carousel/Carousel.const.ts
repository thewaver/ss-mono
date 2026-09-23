import type { CarouselAxis, CarouselDir } from "./Carousel.types";

export const CAROUSEL_DEFAULTS = {
    dir: "row" as CarouselDir,
    axis: "row" as CarouselAxis,
    slideSize: { width: 0, height: 0 },
    transitionDurationMs: 400,
    gap: 0,
};
