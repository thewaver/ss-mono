import type {
    CarouselPickRenderProps,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components";

export type BaseCarouselSlideValues = {
    state: CarouselSlideState;
};

export type BaseCarouselSlideProps = BaseCarouselSlideValues;

export type BaseCarouselStepValues = {
    renderProps: InteractionFlags<CarouselStepRenderProps>;
};

export type BaseCarouselStepProps = BaseCarouselStepValues;

export type BaseCarouselPickValues = {
    renderProps: InteractionFlags<CarouselPickRenderProps>;
};

export type BaseCarouselPickProps = BaseCarouselPickValues;

export type BaseCarouselRotationValues = {
    flags: InteractionFlags<CarouselRotationFlags>;
};

export type BaseCarouselRotationProps = BaseCarouselRotationValues;
