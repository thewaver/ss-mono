import { useMemo, useState } from "react";

import { CAROUSEL_DEFAULTS, CarouselPlacementUtils, type CarouselPlacements } from "@thewaver/ss-components-react";
import type { CarouselOrientation } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { PLACEMENT_FRAMES, TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";
import { toFramedPlacement } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.utils";

import type { CarouselsControls } from "./Carousels.types";

export const useCarouselsControls = (): CarouselsControls => {
    const slideCountState = useState(CarouselKnobs.STARTING_SLIDE_COUNT);
    const delayState = useState(CarouselKnobs.STARTING_DELAY_MS);
    const transitionDurationState = useState(CAROUSEL_DEFAULTS.transitionDurationMs);
    const orientationState = useState<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const isDisabledState = useState(CarouselKnobs.STARTING_IS_DISABLED);
    const isLoopingState = useState(CAROUSEL_DEFAULTS.isLooping);
    const placementState = useState<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);

    const [slideCount] = slideCountState;
    const [orientation] = orientationState;
    const [transitionDuration] = transitionDurationState;
    const [isDisabled] = isDisabledState;
    const [placement] = placementState;

    const placementRule = useMemo(
        () => CarouselPlacementUtils.toPlacementRule(toFramedPlacement(placement, orientation)),
        [placement, orientation],
    );

    const slides = useMemo(() => TITLES.slice(0, slideCount), [slideCount]);

    const sharedProps = useMemo(
        () => ({
            slides,
            isDisabled,
            orientation,
            transitionDurationMs: transitionDuration,
            placement: placementRule,
            frameClasses: styles.slideFrames[PLACEMENT_FRAMES[placement] ?? "whole"][orientation],
        }),
        [slides, isDisabled, orientation, transitionDuration, placementRule, placement],
    );

    return {
        slideCountState,
        delay: delayState,
        transitionDuration: transitionDurationState,
        orientation: orientationState,
        isDisabled: isDisabledState,
        isLooping: isLoopingState,
        placement: placementState,
        slideCount,
        sharedProps,
    };
};
