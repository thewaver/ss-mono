import { createMemo, createSignal } from "solid-js";

import type { CarouselAxis } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { createCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RotatingExample } from "./Examples/Rotating";
import { SteppedExample } from "./Examples/Stepped";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/DrumCarouselPage/Examples";

export const DrumCarouselPage = () => {
    const controls = createCarouselsControls();

    const getAxis = (): CarouselAxis => (controls.orientationSignal[0]() === "horizontal" ? "row" : "column");

    const steppedIndexSignal = createSignal(0);
    const rotatingIndexSignal = createSignal(0);
    const rotatingPlayingSignal = createSignal(true);
    const barelessIndexSignal = createSignal(0);

    const getExamples = createMemo(() => [
        {
            key: "stepped",
            name: "Stepped by hand",
            readout: () =>
                `slide ${steppedIndexSignal[0]() + 1} of ${controls.getSlideCount()} — the slides sit on the faces of a drum, turning about the axis the direction names and swiped along it`,
            component: () => (
                <PageCarouselBox>
                    <SteppedExample {...controls.getSharedProps()} indexSignal={steppedIndexSignal} axis={getAxis} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "rotating",
            name: "Rotating on its own",
            readout: () =>
                `slide ${rotatingIndexSignal[0]() + 1} of ${controls.getSlideCount()} | ${rotatingPlayingSignal[0]() ? "playing" : "stopped"} — the barrel turns itself, and holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background`,
            component: () => (
                <PageCarouselBox>
                    <RotatingExample
                        {...controls.getSharedProps()}
                        indexSignal={rotatingIndexSignal}
                        playbackSignal={rotatingPlayingSignal}
                        autoplayDelayMs={controls.delaySignal[0]}
                        axis={getAxis}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Rotating.tsx`,
        },
        {
            key: "noControls",
            name: "No controls at all",
            readout: () =>
                `slide ${barelessIndexSignal[0]() + 1} of ${controls.getSlideCount()} — nothing is drawn beside the drum, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample
                        {...controls.getSharedProps()}
                        indexSignal={barelessIndexSignal}
                        axis={getAxis}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
    ]);

    return (
        <>
            <PageCarouselsPanel controls={controls} hasDelay={true} />

            <PageExamples items={getExamples} />
        </>
    );
};
