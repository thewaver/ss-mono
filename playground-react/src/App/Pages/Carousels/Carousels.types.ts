import type { CarouselAxis, CarouselOrientation } from "@thewaver/ss-components-react";

type ValueState<T> = readonly [T, (value: T) => void];

export type CarouselExampleProps = {
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    indexState: ValueState<number>;
    playbackState?: ValueState<boolean>;
};

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "orientation"> & {
    axis: CarouselAxis;
};

export type CarouselSharedProps = Omit<CarouselExampleProps, "indexState" | "autoplayDelayMs" | "playbackState">;

export type CarouselsControls = {
    slideCountState: ValueState<number>;
    delayState: ValueState<number>;
    orientationState: ValueState<CarouselOrientation>;
    isDisabledState: ValueState<boolean>;
    isLoopingState: ValueState<boolean>;
    slideCount: number;
    slides: string[];
    sharedProps: CarouselSharedProps;
};
