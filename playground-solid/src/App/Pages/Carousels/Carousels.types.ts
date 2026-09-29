import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, CarouselAxis, CarouselOrientation } from "@thewaver/ss-components-solid";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    index: Signal<number>;
    playback?: Signal<boolean>;
}>;

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "orientation"> &
    AccessorProps<{
        axis: CarouselAxis;
    }>;

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCount: Signal<number>;
    delay: Signal<number>;
    orientation: Signal<CarouselOrientation>;
    isDisabled: Signal<boolean>;
    isLooping: Signal<boolean>;
    getSlideCount: Accessor<number>;
    getSlides: Accessor<string[]>;
    getSharedProps: Accessor<CarouselSharedProps>;
};
