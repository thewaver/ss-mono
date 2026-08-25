import type {
    AccessorProps,
    CarouselPickFlags,
    CarouselRotationFlags,
    CarouselSlideState,
    CarouselStepFlags,
    InteractionFlags,
} from "@thewaver/ss-components";

export type CarouselSlideProps = AccessorProps<{
    state: CarouselSlideState;
}>;

export type CarouselStepProps = AccessorProps<{
    flags: InteractionFlags<CarouselStepFlags>;
}>;

export type CarouselPickProps = AccessorProps<{
    flags: InteractionFlags<CarouselPickFlags>;
}>;

export type CarouselRotationProps = AccessorProps<{
    flags: InteractionFlags<CarouselRotationFlags>;
}>;
