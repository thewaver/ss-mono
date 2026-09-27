import type {
    AccessorProps,
    CarouselPickRenderProps,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselStepRenderProps,
    InteractionFlags,
} from "@thewaver/ss-components-solid";

export type CarouselSlideProps = AccessorProps<{
    state: CarouselSlideState;
}>;

export type CarouselStepProps = AccessorProps<{
    renderProps: InteractionFlags<CarouselStepRenderProps>;
}>;

export type CarouselPickProps = AccessorProps<{
    renderProps: InteractionFlags<CarouselPickRenderProps>;
}>;

export type CarouselRotationProps = AccessorProps<{
    flags: InteractionFlags<CarouselRotationFlags>;
}>;
