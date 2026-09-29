import type {
    CarouselPickRenderProps,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components-react";

export type CarouselSlideProps = {
    state: CarouselSlideState;
};

export type CarouselStepProps = {
    renderProps: InteractionFlags<CarouselStepRenderProps>;
};

export type CarouselPickProps = {
    renderProps: InteractionFlags<CarouselPickRenderProps>;
};

export type CarouselRotationProps = {
    flags: InteractionFlags<CarouselRotationFlags>;
};
