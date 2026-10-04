import { computed, shallowRef } from "vue";

import { CAROUSEL_DEFAULTS, CarouselPlacementUtils, CarouselPlacements } from "@thewaver/ss-components-vue";
import type { CarouselOrientation } from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { NARROW_PLACEMENTS, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import type { CarouselsControls } from "./Carousels.types";

export const useCarouselsControls = (): CarouselsControls => {
    const slideCount = shallowRef(CarouselKnobs.STARTING_SLIDE_COUNT);
    const delay = shallowRef(CarouselKnobs.STARTING_DELAY_MS);
    const orientation = shallowRef<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const isDisabled = shallowRef(CarouselKnobs.STARTING_IS_DISABLED);
    const isLooping = shallowRef(CAROUSEL_DEFAULTS.isLooping);
    const placement = shallowRef<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);

    const computePlacement = computed(() =>
        CarouselPlacementUtils.toPlacementFn(CarouselPlacements.SAMPLE_PLACEMENTS[placement.value]),
    );

    const slides = computed(() => TITLES.slice(0, slideCount.value));

    const sharedProps = computed(() => ({
        slides: slides.value,
        isDisabled: isDisabled.value,
        orientation: orientation.value,
        isNarrow: NARROW_PLACEMENTS.includes(placement.value),
        computePlacement: computePlacement.value,
    }));

    return {
        slideCount,
        delay,
        orientation,
        isDisabled,
        isLooping,
        placement,
        slides,
        sharedProps,
    };
};
