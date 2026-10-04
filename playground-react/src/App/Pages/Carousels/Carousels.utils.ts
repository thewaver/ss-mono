import { useMemo, useState } from "react";

import { CAROUSEL_DEFAULTS, CarouselPlacementUtils, CarouselPlacements } from "@thewaver/ss-components-react";
import type { CarouselOrientation } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { NARROW_PLACEMENTS, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import type { CarouselsControls } from "./Carousels.types";

export const useCarouselsControls = (): CarouselsControls => {
    const slideCountState = useState(CarouselKnobs.STARTING_SLIDE_COUNT);
    const delayState = useState(CarouselKnobs.STARTING_DELAY_MS);
    const orientationState = useState<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const isDisabledState = useState(CarouselKnobs.STARTING_IS_DISABLED);
    const isLoopingState = useState(CAROUSEL_DEFAULTS.isLooping);
    const placementState = useState<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);

    const [slideCount] = slideCountState;
    const [orientation] = orientationState;
    const [isDisabled] = isDisabledState;
    const [placement] = placementState;

    const computePlacement = useMemo(
        () => CarouselPlacementUtils.toPlacementFn(CarouselPlacements.SAMPLE_PLACEMENTS[placement]),
        [placement],
    );

    const slides = useMemo(() => TITLES.slice(0, slideCount), [slideCount]);

    const sharedProps = useMemo(
        () => ({
            slides,
            isDisabled,
            orientation,
            computePlacement,
            isNarrow: NARROW_PLACEMENTS.includes(placement),
        }),
        [slides, isDisabled, orientation, computePlacement, placement],
    );

    return {
        slideCountState,
        delay: delayState,
        orientation: orientationState,
        isDisabled: isDisabledState,
        isLooping: isLoopingState,
        placement: placementState,
        slideCount,
        slides,
        sharedProps,
    };
};
