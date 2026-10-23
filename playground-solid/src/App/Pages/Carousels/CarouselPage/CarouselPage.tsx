import { createMemo, createSignal } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    WINDOWED_SLIDE_COUNT,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import {
    computePairs,
    toPairableSlides,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { createCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { PairsExample } from "./Examples/Pairs";
import { RotatingExample } from "./Examples/Rotating";
import { ScrolledExample } from "./Examples/Scrolled";
import { SteppedExample } from "./Examples/Stepped";
import { WindowedExample } from "./Examples/Windowed";

export const CarouselPage = () => {
    const controls = createCarouselsControls();

    const manualIndexSignal = createSignal(0);
    const rotatingIndexSignal = createSignal(0);
    const rotatingPlayingSignal = createSignal(true);
    const barelessIndexSignal = createSignal(0);
    const scrolledIndexSignal = createSignal(0);
    const windowedIndexSignal = createSignal(0);
    const [getBuiltCount, setBuiltCount] = createSignal(0);
    const pairsIndexSignal = createSignal(0);

    const getPairCount = createMemo(
        () => computePairs(toPairableSlides(access(controls.getSharedProps().slides)).length).length,
    );

    const getExamples = createMemo(() => [
        {
            key: "manual",
            name: EXAMPLE_NAMES.manual,
            readout: () =>
                `slide ${manualIndexSignal[0]() + 1} of ${controls.getSlideCount()} — ${controls.isLooping[0]() ? "stepping past either end comes round the short way, so the first slide sits beside the last" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; pressing a slide drawn beside the one showing brings it up`,
            component: () => (
                <PageCarouselBox>
                    <SteppedExample
                        {...controls.getSharedProps()}
                        isLooping={controls.isLooping[0]}
                        index={manualIndexSignal}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "rotating",
            name: EXAMPLE_NAMES.rotating,
            readout: () =>
                `slide ${rotatingIndexSignal[0]() + 1} of ${controls.getSlideCount()} | ${rotatingPlayingSignal[0]() ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${controls.isLooping[0]() ? "" : "; with looping off it stops for good on the last slide"}`,
            component: () => (
                <PageCarouselBox>
                    <RotatingExample
                        {...controls.getSharedProps()}
                        isLooping={controls.isLooping[0]}
                        index={rotatingIndexSignal}
                        playback={rotatingPlayingSignal}
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
                `slide ${scrolledIndexSignal[0]() + 1} of ${controls.getSlideCount()} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
            component: () => <ScrolledExample {...controls.getSharedProps()} index={scrolledIndexSignal} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "noControls",
            name: EXAMPLE_NAMES.noControls,
            readout: () =>
                `slide ${barelessIndexSignal[0]() + 1} of ${controls.getSlideCount()} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample {...controls.getSharedProps()} index={barelessIndexSignal} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
        {
            key: "windowed",
            name: EXAMPLE_NAMES.windowed,
            readout: () =>
                `slide ${windowedIndexSignal[0]() + 1} of ${WINDOWED_SLIDE_COUNT} | ${getBuiltCount()} built — only the slides the placement can draw exist, so the rest cost nothing, and a slide that comes back is built afresh`,
            component: () => {
                const { slides: _slides, ...sharedProps } = controls.getSharedProps();

                return (
                    <PageCarouselBox>
                        <WindowedExample
                            {...sharedProps}
                            isLooping={controls.isLooping[0]}
                            index={windowedIndexSignal}
                            onBuiltChange={(change) => setBuiltCount((prev) => prev + change)}
                        />
                    </PageCarouselBox>
                );
            },
            path: `${EXAMPLES_ROOT}/Windowed.tsx`,
        },
        {
            key: "pairs",
            name: EXAMPLE_NAMES.pairs,
            readout: () =>
                `pair ${pairsIndexSignal[0]() + 1} of ${getPairCount()} — the slides two at a time, 1 and 2, then 3 and 4, each pair resting side by side in the room of one slide wherever the placement rests a slide; an odd number of slides is doubled so every pair is whole`,
            component: () => (
                <PageCarouselBox>
                    <PairsExample
                        {...controls.getSharedProps()}
                        isLooping={controls.isLooping[0]}
                        index={pairsIndexSignal}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Pairs.tsx`,
        },
    ]);

    return (
        <>
            <PageCarouselsPanel controls={controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

            <PageExamples items={getExamples} />
        </>
    );
};
