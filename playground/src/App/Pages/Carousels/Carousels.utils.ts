import { createMemo, createSignal } from "solid-js";

import type { CarouselDir } from "@thewaver/ss-components";

import { STARTING_DELAY_MS, STARTING_SLIDE_COUNT, TITLES } from "./Carousels.const";
import type { CarouselsControls } from "./Carousels.types";

export const createCarouselsControls = (): CarouselsControls => {
    const slideCountSignal = createSignal(STARTING_SLIDE_COUNT);
    const delaySignal = createSignal(STARTING_DELAY_MS);
    const dirSignal = createSignal<CarouselDir>("row");
    const isDisabledSignal = createSignal(false);

    const getSlides = createMemo(() => TITLES.slice(0, slideCountSignal[0]()));

    const getSharedProps = createMemo(() => ({
        slides: getSlides,
        isDisabled: isDisabledSignal[0],
        dir: dirSignal[0],
    }));

    return {
        slideCountSignal,
        delaySignal,
        dirSignal,
        isDisabledSignal,
        getSlideCount: slideCountSignal[0],
        getSlides,
        getSharedProps,
    };
};
