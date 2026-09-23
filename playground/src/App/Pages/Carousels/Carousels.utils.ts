import { createMemo, createSignal } from "solid-js";

import { CAROUSEL_DEFAULTS } from "@thewaver/ss-components";
import type { CarouselOrientation } from "@thewaver/ss-components";

import { STARTING_DELAY_MS, STARTING_SLIDE_COUNT, TITLES } from "./Carousels.const";
import type { CarouselsControls } from "./Carousels.types";

export const createCarouselsControls = (): CarouselsControls => {
    const slideCountSignal = createSignal(STARTING_SLIDE_COUNT);
    const delaySignal = createSignal(STARTING_DELAY_MS);
    const orientationSignal = createSignal<CarouselOrientation>("horizontal");
    const isDisabledSignal = createSignal(false);
    const isLoopingSignal = createSignal(CAROUSEL_DEFAULTS.isLooping);

    const getSlides = createMemo(() => TITLES.slice(0, slideCountSignal[0]()));

    const getSharedProps = createMemo(() => ({
        slides: getSlides,
        isDisabled: isDisabledSignal[0],
        orientation: orientationSignal[0],
    }));

    return {
        slideCountSignal,
        delaySignal,
        orientationSignal,
        isDisabledSignal,
        isLoopingSignal,
        getSlideCount: slideCountSignal[0],
        getSlides,
        getSharedProps,
    };
};
