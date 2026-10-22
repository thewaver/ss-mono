import type { CarouselSlideState, CarouselStep, InteractionFlags } from "@thewaver/ss-components";

export type BaseCarouselSlideValues = {
    state: CarouselSlideState;
};

export type BaseCarouselSlideProps = BaseCarouselSlideValues;

export type BaseCarouselStepValues = {
    flags: InteractionFlags;
    step: CarouselStep;
};

export type BaseCarouselStepProps = BaseCarouselStepValues;

export type BaseCarouselPickValues = {
    flags: InteractionFlags;
    isCurrent: boolean;
};

export type BaseCarouselPickProps = BaseCarouselPickValues;

export type BaseCarouselRotationValues = {
    flags: InteractionFlags;
    isPlaying: boolean;
};

export type BaseCarouselRotationProps = BaseCarouselRotationValues;
