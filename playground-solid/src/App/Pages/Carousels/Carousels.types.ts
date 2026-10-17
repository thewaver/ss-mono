import type { Accessor, Signal } from "solid-js";

import type {
    AccessorProps,
    CarouselOrientation,
    CarouselPlacementRule,
    CarouselPlacements,
} from "@thewaver/ss-components-solid";
import type { SlideFrameClasses } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.types";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    transitionDurationMs: number;
    autoplayDelayMs?: number;
    index: Signal<number>;
    playback?: Signal<boolean>;
    frameClasses: SlideFrameClasses;
}> & {
    placement: CarouselPlacementRule;
};

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCount: Signal<number>;
    delay: Signal<number>;
    transitionDuration: Signal<number>;
    orientation: Signal<CarouselOrientation>;
    isDisabled: Signal<boolean>;
    isLooping: Signal<boolean>;
    placement: Signal<CarouselPlacements.SampleKey>;
    getSlideCount: Accessor<number>;
    getSharedProps: Accessor<CarouselSharedProps>;
};
