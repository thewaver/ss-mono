import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, CarouselAxis, CarouselOrientation } from "@thewaver/ss-components";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    indexSignal: Signal<number>;
    playbackSignal?: Signal<boolean>;
}>;

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "orientation"> &
    AccessorProps<{
        axis: CarouselAxis;
    }>;

export type CarouselSharedProps = Omit<CarouselExampleProps, "indexSignal" | "autoplayDelayMs" | "playbackSignal">;

export type CarouselsControls = {
    slideCountSignal: Signal<number>;
    delaySignal: Signal<number>;
    orientationSignal: Signal<CarouselOrientation>;
    isDisabledSignal: Signal<boolean>;
    isLoopingSignal: Signal<boolean>;
    getSlideCount: Accessor<number>;
    getSlides: Accessor<string[]>;
    getSharedProps: Accessor<CarouselSharedProps>;
};
