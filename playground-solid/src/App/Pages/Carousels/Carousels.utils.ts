import { createMemo, createSignal } from "solid-js";

import { CAROUSEL_DEFAULTS } from "@thewaver/ss-components-solid";
import type { CarouselOrientation } from "@thewaver/ss-components-solid";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import type { CarouselsControls } from "./Carousels.types";

export const createCarouselsControls = (): CarouselsControls => {
    const slideCountSignal = createSignal(CarouselKnobs.STARTING_SLIDE_COUNT);
    const delaySignal = createSignal(CarouselKnobs.STARTING_DELAY_MS);
    const orientationSignal = createSignal<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const isDisabledSignal = createSignal(CarouselKnobs.STARTING_IS_DISABLED);
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
