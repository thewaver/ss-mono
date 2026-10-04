import { useState } from "react";

import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { useCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RingExample } from "./Examples/Ring";
import { RotatingExample } from "./Examples/Rotating";
import { ScrolledExample } from "./Examples/Scrolled";
import { SteppedExample } from "./Examples/Stepped";
import { WordDrumExample } from "./Examples/WordDrum";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/CarouselPage/Examples";

export const CarouselPage = () => {
    const controls = useCarouselsControls();

    const manualIndexState = useState(0);
    const rotatingIndexState = useState(0);
    const rotatingPlayingState = useState(true);
    const barelessIndexState = useState(0);
    const scrolledIndexState = useState(0);
    const ringIndexState = useState(0);
    const wordDrumIndexState = useState(0);

    const [isLooping] = controls.isLooping;

    const examples = [
        {
            key: "manual",
            name: "Stepped by hand",
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
            name: "Rotating on its own",
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
            key: "noControls",
            name: "No controls at all",
            readout: () =>
                `slide ${barelessIndexState[0] + 1} of ${controls.slideCount} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample {...controls.sharedProps} index={barelessIndexState} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
        {
            key: "scrolled",
            name: "Driven by a scroll",
            readout: () =>
                `slide ${scrolledIndexState[0] + 1} of ${controls.slideCount} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
            component: () => <ScrolledExample {...controls.sharedProps} index={scrolledIndexState} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "ring",
            name: "A ring that turns and leans",
            readout: () =>
                `slide ${ringIndexState[0] + 1} of ${controls.slideCount} — the paddle wheel rule, the slides standing round an upright spine with each painting only the half away from it, inside a Tilter, with its progress written on a clock for a continuous turn; Stop is the way to halt it that a turn running on its own owes the reader`,
            component: () => (
                <RingExample
                    slides={controls.slides}
                    index={ringIndexState}
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
                `word ${wordDrumIndexState[0] + 1} of ${CarouselKnobs.WORD_DRUM_WORDS.length} — the drum rule with a word on each face, its progress written by the box's scroll, so scrolling rolls the next word up`,
            component: () => <WordDrumExample index={wordDrumIndexState} isDisabled={controls.isDisabled[0]} />,
            path: `${EXAMPLES_ROOT}/WordDrum.tsx`,
        },
    ];

    return (
        <>
            <PageCarouselsPanel controls={controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

            <PageExamples items={examples} />
        </>
    );
};
