import type { ComputedRef, Ref } from "vue";

import type { CarouselOrientation, CarouselPlacementFn, CarouselPlacements } from "@thewaver/ss-components-vue";

export type CarouselExampleProps = {
    "slides": string[];
    "isDisabled": boolean;
    "isLooping"?: boolean;
    "orientation": CarouselOrientation;
    "autoplayDelayMs"?: number;
    "index": number;
    "onUpdate:index"?: (value: number) => void;
    "playback"?: boolean;
    "onUpdate:playback"?: (value: boolean) => void;
    "computePlacement": CarouselPlacementFn;
    "isNarrow": boolean;
};

export type CarouselSharedProps = Omit<
    CarouselExampleProps,
    "index" | "onUpdate:index" | "autoplayDelayMs" | "playback" | "onUpdate:playback"
>;

export type CarouselsControls = {
    slideCount: Ref<number>;
    delay: Ref<number>;
    orientation: Ref<CarouselOrientation>;
    isDisabled: Ref<boolean>;
    isLooping: Ref<boolean>;
    placement: Ref<CarouselPlacements.SampleKey>;
    slides: ComputedRef<string[]>;
    sharedProps: ComputedRef<CarouselSharedProps>;
};

export type PageCarouselsPanelProps = {
    controls: CarouselsControls;
    hasDelay?: boolean;
    hasLooping?: boolean;
    hasPlacement?: boolean;
};
