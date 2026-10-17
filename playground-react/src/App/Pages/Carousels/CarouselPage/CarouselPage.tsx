import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { useCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RotatingExample } from "./Examples/Rotating";
import { ScrolledExample } from "./Examples/Scrolled";
import { SteppedExample } from "./Examples/Stepped";

export const CarouselPage = () => {
    const controls = useCarouselsControls();

    const manualIndexState = useState(0);
    const rotatingIndexState = useState(0);
    const rotatingPlayingState = useState(true);
    const barelessIndexState = useState(0);
    const scrolledIndexState = useState(0);

    const [isLooping] = controls.isLooping;

    const examples = [
        {
            key: "manual",
            name: EXAMPLE_NAMES.manual,
            readout: () =>
                `slide ${manualIndexState[0] + 1} of ${controls.slideCount} — ${isLooping ? "stepping past either end comes round the short way, so the first slide sits beside the last" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; pressing a slide drawn beside the one showing brings it up`,
            component: () => (
                <PageCarouselBox>
                    <SteppedExample {...controls.sharedProps} isLooping={isLooping} index={manualIndexState} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "rotating",
            name: EXAMPLE_NAMES.rotating,
            readout: () =>
                `slide ${rotatingIndexState[0] + 1} of ${controls.slideCount} | ${rotatingPlayingState[0] ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${isLooping ? "" : "; with looping off it stops for good on the last slide"}`,
            component: () => (
                <PageCarouselBox>
                    <RotatingExample
                        {...controls.sharedProps}
                        isLooping={isLooping}
                        index={rotatingIndexState}
                        playback={rotatingPlayingState}
                        autoplayDelayMs={controls.delay[0]}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Rotating.tsx`,
        },
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `slide ${scrolledIndexState[0] + 1} of ${controls.slideCount} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
            component: () => <ScrolledExample {...controls.sharedProps} index={scrolledIndexState} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "noControls",
            name: EXAMPLE_NAMES.noControls,
            readout: () =>
                `slide ${barelessIndexState[0] + 1} of ${controls.slideCount} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample {...controls.sharedProps} index={barelessIndexState} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
    ];

    return (
        <>
            <PageCarouselsPanel controls={controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

            <PageExamples items={examples} />
        </>
    );
};
