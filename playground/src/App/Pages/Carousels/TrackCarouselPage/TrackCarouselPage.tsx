import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { createCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RotatingExample } from "./Examples/Rotating";
import { SteppedExample } from "./Examples/Stepped";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/TrackCarouselPage/Examples";

export const TrackCarouselPage = () => {
    const controls = createCarouselsControls();

    const manualIndexSignal = createSignal(0);
    const rotatingIndexSignal = createSignal(0);
    const rotatingPlayingSignal = createSignal(true);
    const barelessIndexSignal = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "manual",
            name: "Stepped by hand",
            readout: () =>
                `slide ${manualIndexSignal[0]() + 1} of ${controls.getSlideCount()} — ${controls.isLoopingSignal[0]() ? "stepping past either end wraps round, which is what separates this from the scroller" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; a column takes its height from the box the page puts round it`,
            component: () => (
                <PageCarouselBox>
                    <SteppedExample
                        {...controls.getSharedProps()}
                        isLooping={controls.isLoopingSignal[0]}
                        indexSignal={manualIndexSignal}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "rotating",
            name: "Rotating on its own",
            readout: () =>
                `slide ${rotatingIndexSignal[0]() + 1} of ${controls.getSlideCount()} | ${rotatingPlayingSignal[0]() ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${controls.isLoopingSignal[0]() ? "" : "; with looping off it stops for good on the last slide"}`,
            component: () => (
                <PageCarouselBox>
                    <RotatingExample
                        {...controls.getSharedProps()}
                        isLooping={controls.isLoopingSignal[0]}
                        indexSignal={rotatingIndexSignal}
                        playbackSignal={rotatingPlayingSignal}
                        autoplayDelayMs={controls.delaySignal[0]}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Rotating.tsx`,
        },
        {
            key: "noControls",
            name: "No controls at all",
            readout: () =>
                `slide ${barelessIndexSignal[0]() + 1} of ${controls.getSlideCount()} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample {...controls.getSharedProps()} indexSignal={barelessIndexSignal} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
    ]);

    return (
        <>
            <PageCarouselsPanel controls={controls} hasDelay={true} hasLooping={true} />

            <PageExamples items={getExamples} />
        </>
    );
};
