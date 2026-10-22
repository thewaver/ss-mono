import type { ComputedRef, Ref } from "vue";

import type {
    CarouselControls,
    CarouselOrientation,
    CarouselPlacementRule,
    CarouselPlacements,
} from "@thewaver/ss-components-vue";
import type { SlideFrameClasses } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.types";

export type CarouselExampleProps = {
    "slides": string[];
    "isDisabled": boolean;
    "isLooping"?: boolean;
    "orientation": CarouselOrientation;
    "transitionDurationMs": number;
    "autoplayDelayMs"?: number;
    "index": number;
    "onUpdate:index"?: (value: number) => void;
    "playback"?: boolean;
    "onUpdate:playback"?: (value: boolean) => void;
    "placement": CarouselPlacementRule;
    "frameClasses": SlideFrameClasses;
};

export type CarouselSharedProps = Omit<
    CarouselExampleProps,
    "index" | "onUpdate:index" | "autoplayDelayMs" | "playback" | "onUpdate:playback"
>;

export type CarouselsControls = {
    slideCount: Ref<number>;
    delay: Ref<number>;
    transitionDuration: Ref<number>;
    orientation: Ref<CarouselOrientation>;
    isDisabled: Ref<boolean>;
    isLooping: Ref<boolean>;
    placement: Ref<CarouselPlacements.SampleKey>;
    sharedProps: ComputedRef<CarouselSharedProps>;
};

export type PageCarouselsPanelProps = {
    controls: CarouselsControls;
    hasDelay?: boolean;
    hasLooping?: boolean;
    hasPlacement?: boolean;
};

export type PageCarouselsBarProps = {
    controls: CarouselControls;
    isDisabled: boolean;
    hasPicks?: boolean;
    hasRotation?: boolean;
};
