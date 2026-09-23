import type { CarouselAxis, CarouselOrientation } from "./Carousel.types";

export const CAROUSEL_DEFAULTS = {
    orientation: "horizontal" as CarouselOrientation,
    axis: "row" as CarouselAxis,
    slideSize: { width: 0, height: 0 },
    transitionDurationMs: 400,
    gap: 0,
    isLooping: true,
    roleDescription: "carousel",
    slideRoleDescription: "slide",
};
