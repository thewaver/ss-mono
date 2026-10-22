import type { CarouselOrientation } from "./Carousel.types";

export const CAROUSEL_DEFAULTS = {
    orientation: "horizontal" as CarouselOrientation,
    transitionDurationMs: 400,
    isLooping: true,
    isWindowed: false,
    roleDescription: "carousel",
    slideRoleDescription: "slide",
};

export const CAROUSEL_ORIENTATIONS: readonly CarouselOrientation[] = ["horizontal", "vertical"];
