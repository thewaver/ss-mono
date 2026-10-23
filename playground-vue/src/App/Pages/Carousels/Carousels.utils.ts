import { computed, shallowRef } from "vue";

import { CAROUSEL_DEFAULTS, CarouselPlacementUtils, type CarouselPlacements } from "@thewaver/ss-components-vue";
import type { CarouselOrientation } from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { PLACEMENT_FRAMES, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
import { toFramedPlacement } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.utils";

import type { CarouselsControls } from "./Carousels.types";

export const useCarouselsControls = (): CarouselsControls => {
    const slideCount = shallowRef(CarouselKnobs.STARTING_SLIDE_COUNT);
    const delay = shallowRef(CarouselKnobs.STARTING_DELAY_MS);
    const transitionDuration = shallowRef(CAROUSEL_DEFAULTS.transitionDurationMs);
    const orientation = shallowRef<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const isDisabled = shallowRef(CarouselKnobs.STARTING_IS_DISABLED);
    const isLooping = shallowRef(CAROUSEL_DEFAULTS.isLooping);
    const placement = shallowRef<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);

    const placementRule = computed(() =>
        CarouselPlacementUtils.toPlacementRule(toFramedPlacement(placement.value, orientation.value)),
    );

    const slides = computed(() => TITLES.slice(0, slideCount.value));

    const sharedProps = computed(() => ({
        slides: slides.value,
        isDisabled: isDisabled.value,
        orientation: orientation.value,
        transitionDurationMs: transitionDuration.value,
        frameClasses: styles.slideFrames[PLACEMENT_FRAMES[placement.value] ?? "whole"][orientation.value],
        placement: placementRule.value,
    }));

    return {
        slideCount,
        delay,
        transitionDuration,
        orientation,
        isDisabled,
        isLooping,
        placement,
        sharedProps,
    };
};
