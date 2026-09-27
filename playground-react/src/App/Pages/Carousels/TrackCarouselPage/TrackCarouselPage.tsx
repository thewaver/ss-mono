import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { useCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RotatingExample } from "./Examples/Rotating";
import { SteppedExample } from "./Examples/Stepped";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/TrackCarouselPage/Examples";

export const TrackCarouselPage = () => {
    const controls = useCarouselsControls();

    const manualIndexState = useState(0);
    const rotatingIndexState = useState(0);
    const rotatingPlayingState = useState(true);
    const barelessIndexState = useState(0);

    const [isLooping] = controls.isLoopingState;

    const examples = [
        {
            key: "manual",
            name: "Stepped by hand",
            readout: () =>
                `slide ${manualIndexState[0] + 1} of ${controls.slideCount} — ${isLooping ? "stepping past either end wraps round, which is what separates this from the scroller" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; a column takes its height from the box the page puts round it`,
            component: () => (
                <PageCarouselBox>
                    <SteppedExample {...controls.sharedProps} isLooping={isLooping} indexState={manualIndexState} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "rotating",
            name: "Rotating on its own",
            readout: () =>
                `slide ${rotatingIndexState[0] + 1} of ${controls.slideCount} | ${rotatingPlayingState[0] ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${isLooping ? "" : "; with looping off it stops for good on the last slide"}`,
            component: () => (
                <PageCarouselBox>
                    <RotatingExample
                        {...controls.sharedProps}
                        isLooping={isLooping}
                        indexState={rotatingIndexState}
                        playbackState={rotatingPlayingState}
                        autoplayDelayMs={controls.delayState[0]}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Rotating.tsx`,
        },
        {
            key: "noControls",
            name: "No controls at all",
            readout: () =>
                `slide ${barelessIndexState[0] + 1} of ${controls.slideCount} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample {...controls.sharedProps} indexState={barelessIndexState} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
    ];

    return (
        <>
            <PageCarouselsPanel controls={controls} hasDelay={true} hasLooping={true} />

            <PageExamples items={examples} />
        </>
    );
};
