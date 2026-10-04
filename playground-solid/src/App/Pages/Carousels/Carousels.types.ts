import type { Accessor, Signal } from "solid-js";

import type {
    AccessorProps,
    CarouselOrientation,
    CarouselPlacementFn,
    CarouselPlacements,
} from "@thewaver/ss-components-solid";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    index: Signal<number>;
    playback?: Signal<boolean>;
    computePlacement: CarouselPlacementFn;
    isNarrow: boolean;
}>;

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCount: Signal<number>;
    delay: Signal<number>;
    orientation: Signal<CarouselOrientation>;
    isDisabled: Signal<boolean>;
    isLooping: Signal<boolean>;
    placement: Signal<CarouselPlacements.SampleKey>;
    getSlideCount: Accessor<number>;
    getSlides: Accessor<string[]>;
    getSharedProps: Accessor<CarouselSharedProps>;
};
