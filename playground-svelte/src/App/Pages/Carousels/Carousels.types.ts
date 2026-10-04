import type { CarouselOrientation, CarouselPlacementFn, CarouselPlacements } from "@thewaver/ss-components-svelte";

export type CarouselExampleProps = {
    slides: string[];
    isDisabled: boolean;
    isLooping?: boolean;
    orientation: CarouselOrientation;
    autoplayDelayMs?: number;
    index: number;
    playback?: boolean;
    computePlacement: CarouselPlacementFn;
    isNarrow: boolean;
};

export type CarouselSharedProps = Omit<CarouselExampleProps, "index" | "autoplayDelayMs" | "playback">;

export type CarouselsControls = {
    slideCount: number;
    delay: number;
    orientation: CarouselOrientation;
    isDisabled: boolean;
    isLooping: boolean;
    placement: CarouselPlacements.SampleKey;
    readonly slides: string[];
    readonly sharedProps: CarouselSharedProps;
};
