import type { CarouselAxis, CarouselOrientation } from "@thewaver/ss-components-react";

type ValueState<T> = readonly [T, (value: T) => void];

export type CarouselExampleProps = {
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    index: ValueState<number>;
    playback?: ValueState<boolean>;
};

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "orientation"> & {
    axis: CarouselAxis;
};

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCountState: ValueState<number>;
    delay: ValueState<number>;
    orientation: ValueState<CarouselOrientation>;
    isDisabled: ValueState<boolean>;
    isLooping: ValueState<boolean>;
    slideCount: number;
    slides: string[];
    sharedProps: CarouselSharedProps;
};
