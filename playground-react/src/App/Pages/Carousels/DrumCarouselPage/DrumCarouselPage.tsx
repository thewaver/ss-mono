import { useState } from "react";

import type { CarouselAxis } from "@thewaver/ss-components-react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageCarouselBox } from "../../../StyledComponents/CarouselContent/CarouselContent";
import { useCarouselsControls } from "../Carousels.utils";
import { PageCarouselsPanel } from "../CarouselsPanel";
import { NoControlsExample } from "./Examples/NoControls";
import { RotatingExample } from "./Examples/Rotating";
import { SteppedExample } from "./Examples/Stepped";

const EXAMPLES_ROOT = "/src/App/Pages/Carousels/DrumCarouselPage/Examples";

export const DrumCarouselPage = () => {
    const controls = useCarouselsControls();

    const axis: CarouselAxis = controls.orientation[0] === "horizontal" ? "row" : "column";

    const steppedIndexState = useState(0);
    const rotatingIndexState = useState(0);
    const rotatingPlayingState = useState(true);
    const barelessIndexState = useState(0);

    const examples = [
        {
            key: "stepped",
            name: "Stepped by hand",
            readout: () =>
                `slide ${steppedIndexState[0] + 1} of ${controls.slideCount} — the slides sit on the faces of a drum, turning about the axis the direction names and swiped along it`,
            component: () => (
                <PageCarouselBox>
                    <SteppedExample {...controls.sharedProps} index={steppedIndexState} axis={axis} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Stepped.tsx`,
        },
        {
            key: "rotating",
            name: "Rotating on its own",
            readout: () =>
                `slide ${rotatingIndexState[0] + 1} of ${controls.slideCount} | ${rotatingPlayingState[0] ? "playing" : "stopped"} — the barrel turns itself, and holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background`,
            component: () => (
                <PageCarouselBox>
                    <RotatingExample
                        {...controls.sharedProps}
                        index={rotatingIndexState}
                        playback={rotatingPlayingState}
                        autoplayDelayMs={controls.delay[0]}
                        axis={axis}
                    />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/Rotating.tsx`,
        },
        {
            key: "noControls",
            name: "No controls at all",
            readout: () =>
                `slide ${barelessIndexState[0] + 1} of ${controls.slideCount} — nothing is drawn beside the drum, so the surrounding page owns the buttons through the signal it shares`,
            component: () => (
                <PageCarouselBox>
                    <NoControlsExample {...controls.sharedProps} index={barelessIndexState} axis={axis} />
                </PageCarouselBox>
            ),
            path: `${EXAMPLES_ROOT}/NoControls.tsx`,
        },
    ];

    return (
        <>
            <PageCarouselsPanel controls={controls} hasDelay={true} />

            <PageExamples items={examples} />
        </>
    );
};
