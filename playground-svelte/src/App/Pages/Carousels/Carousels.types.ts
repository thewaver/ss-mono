import type { CarouselAxis, CarouselOrientation } from "@thewaver/ss-components-svelte";

export type CarouselExampleProps = {
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    index: number;
    playback?: boolean;
};

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "orientation"> & {
    axis: CarouselAxis;
};

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCount: number;
    delay: number;
    orientation: CarouselOrientation;
    isDisabled: boolean;
    isLooping: boolean;
    readonly slides: string[];
    readonly sharedProps: CarouselSharedProps;
};
