import { createMemo, createSignal } from "solid-js";

import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { createCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RingExample } from "./Examples/Ring";
import { RotatingExample } from "./Examples/Rotating";
import { ScrolledExample } from "./Examples/Scrolled";
import { SteppedExample } from "./Examples/Stepped";
import { WordDrumExample } from "./Examples/WordDrum";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/CarouselPage/Examples";

export const CarouselPage = () => {
    const controls = createCarouselsControls();

    const manualIndexSignal = createSignal(0);
    const rotatingIndexSignal = createSignal(0);
    const rotatingPlayingSignal = createSignal(true);
    const barelessIndexSignal = createSignal(0);
    const scrolledIndexSignal = createSignal(0);
    const ringIndexSignal = createSignal(0);
    const wordDrumIndexSignal = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "manual",
            name: "Stepped by hand",
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
            name: "Rotating on its own",
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
            key: "noControls",
            name: "No controls at all",
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
            key: "scrolled",
            name: "Driven by a scroll",
            readout: () =>
                `slide ${scrolledIndexSignal[0]() + 1} of ${controls.getSlideCount()} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
            component: () => <ScrolledExample {...controls.getSharedProps()} index={scrolledIndexSignal} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "ring",
            name: "A ring at the edge",
            readout: () =>
                `slide ${ringIndexSignal[0]() + 1} of ${controls.getSlideCount()} — the paddle wheel rule, the slides standing round an upright spine with each painting only the half away from it, the spine set flush with the box's right edge so only the half turning outward shows, with its progress written on a clock for a continuous turn; Stop is the way to halt it that a turn running on its own owes the reader`,
            component: () => (
                <RingExample
                    slides={controls.getSlides}
                    index={ringIndexSignal}
                    isDisabled={controls.isDisabled[0]}
                    orientation={controls.orientation[0]}
                />
            ),
            path: `${EXAMPLES_ROOT}/Ring.tsx`,
        },
        {
            key: "wordDrum",
            name: "A drum of words turned by scrolling",
            readout: () =>
                `word ${wordDrumIndexSignal[0]() + 1} of ${CarouselKnobs.WORD_DRUM_WORDS.length} — a drum of a fixed number of faces, each a quarter of the box, with a word on each face near the front, its progress written by the box's scroll; scrolling rolls the next word up, and the faces past the first and last word stay empty`,
            component: () => <WordDrumExample index={wordDrumIndexSignal} isDisabled={controls.isDisabled[0]} />,
            path: `${EXAMPLES_ROOT}/WordDrum.tsx`,
        },
    ]);

    return (
        <>
            <PageCarouselsPanel controls={controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

            <PageExamples items={getExamples} />
        </>
    );
};
