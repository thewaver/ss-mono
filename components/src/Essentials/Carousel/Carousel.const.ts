import type { CarouselOrientation } from "./Carousel.types";

export const CAROUSEL_DEFAULTS = {
    orientation: "horizontal" as CarouselOrientation,
    transitionDurationMs: 400,
    gap: 0,
    isLooping: true,
    roleDescription: "carousel",
    slideRoleDescription: "slide",
};

export const CAROUSEL_ORIENTATIONS: readonly CarouselOrientation[] = ["horizontal", "vertical"];
