import type { ComputedRef, Ref } from "vue";

import type { CarouselAxis, CarouselOrientation } from "@thewaver/ss-components-vue";

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
};

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "orientation"> & {
    axis: CarouselAxis;
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
    slides: ComputedRef<string[]>;
    sharedProps: ComputedRef<CarouselSharedProps>;
};

export type PageCarouselsPanelProps = {
    controls: CarouselsControls;
    hasDelay?: boolean;
    hasLooping?: boolean;
};
