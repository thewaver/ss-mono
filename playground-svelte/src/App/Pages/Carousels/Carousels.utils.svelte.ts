import { CAROUSEL_DEFAULTS, CarouselPlacementUtils, CarouselPlacements } from "@thewaver/ss-components-svelte";
import type { CarouselOrientation } from "@thewaver/ss-components-svelte";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { PLACEMENT_FRAMES, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

import type { CarouselsControls } from "./Carousels.types";

export const createCarouselsControls = (): CarouselsControls => {
    let slideCount = $state(CarouselKnobs.STARTING_SLIDE_COUNT);
    let delay = $state(CarouselKnobs.STARTING_DELAY_MS);
    let orientation = $state<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    let isDisabled = $state(CarouselKnobs.STARTING_IS_DISABLED);
    let isLooping = $state(CAROUSEL_DEFAULTS.isLooping);
    let placement = $state<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);

    const computePlacement = $derived(
        CarouselPlacementUtils.toPlacementFn(CarouselPlacements.SAMPLE_PLACEMENTS[placement]),
    );

    const slides = $derived(TITLES.slice(0, slideCount));

    const sharedProps = $derived({
        slides,
        isDisabled,
        orientation,
        frameClasses: styles.slideFrames[PLACEMENT_FRAMES[placement] ?? "whole"][orientation],
        computePlacement,
    });

    return {
        get slideCount() {
            return slideCount;
        },
        set slideCount(value) {
            slideCount = value;
        },
        get delay() {
            return delay;
        },
        set delay(value) {
            delay = value;
        },
        get orientation() {
            return orientation;
        },
        set orientation(value) {
            orientation = value;
        },
        get isDisabled() {
            return isDisabled;
        },
        set isDisabled(value) {
            isDisabled = value;
        },
        get isLooping() {
            return isLooping;
        },
        set isLooping(value) {
            isLooping = value;
        },
        get placement() {
            return placement;
        },
        set placement(value) {
            placement = value;
        },
        get slides() {
            return slides;
        },
        get sharedProps() {
            return sharedProps;
        },
    };
};
