import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, CarouselAxis, CarouselDir } from "@thewaver/ss-components";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    dir: CarouselDir;
    autoplayDelayMs?: number;
    indexSignal: Signal<number>;
    playingSignal?: Signal<boolean>;
}>;

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "dir"> &
    AccessorProps<{
        axis: CarouselAxis;
    }>;

export type CarouselSharedProps = Omit<CarouselExampleProps, "indexSignal" | "autoplayDelayMs" | "playingSignal">;

export type CarouselsControls = {
    slideCountSignal: Signal<number>;
    delaySignal: Signal<number>;
    dirSignal: Signal<CarouselDir>;
    isDisabledSignal: Signal<boolean>;
    getSlideCount: Accessor<number>;
    getSlides: Accessor<string[]>;
    getSharedProps: Accessor<CarouselSharedProps>;
};
