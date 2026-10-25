import type { CarouselOrientation, CarouselPlacements } from "@thewaver/ss-components";

export type BaseCarouselBasicDocsExampleValues = {
    orientation: CarouselOrientation;
    transitionDurationMs: number;
    isDisabled: boolean;
};

export type BaseCarouselLooksDocsExampleValues = {
    placement: CarouselPlacements.SampleKey;
    orientation: CarouselOrientation;
};

export type BaseCarouselLoopingDocsExampleValues = {
    isLooping: boolean;
    autoplayDelayMs: number;
};
