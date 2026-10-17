import type { CarouselOrientation, CarouselPlacementRule, CarouselPlacements } from "@thewaver/ss-components-react";
import type { SlideFrameClasses } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.types";

type ValueState<T> = readonly [T, (value: T) => void];

export type CarouselExampleProps = {
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    transitionDurationMs: number;
    autoplayDelayMs?: number;
    index: ValueState<number>;
    playback?: ValueState<boolean>;
    placement: CarouselPlacementRule;
    frameClasses: SlideFrameClasses;
};

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCountState: ValueState<number>;
    delay: ValueState<number>;
    transitionDuration: ValueState<number>;
    orientation: ValueState<CarouselOrientation>;
    isDisabled: ValueState<boolean>;
    isLooping: ValueState<boolean>;
    placement: ValueState<CarouselPlacements.SampleKey>;
    slideCount: number;
    sharedProps: CarouselSharedProps;
};
