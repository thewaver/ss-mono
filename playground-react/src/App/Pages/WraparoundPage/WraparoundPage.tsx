import { useState } from "react";

import { MediaQueryMonitorReactUtils, WRAPAROUND_DEFAULTS } from "@thewaver/ss-components-react";
import { WraparoundKnobs } from "@thewaver/ss-playground/App/Knobs/Wraparounds.const";
import { NOTHING_PRESSED } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { GridExample } from "./Examples/Grid";
import { MarqueeExample } from "./Examples/Marquee";
import { MosaicExample } from "./Examples/Mosaic";

const EXAMPLES_ROOT = "/src/App/Pages/WraparoundPage/Examples";

const NO_DRIFT_PX_PER_SECOND = 0;

export const WraparoundPage = () => {
    const [mosaicPressed, setMosaicPressed] = useState(NOTHING_PRESSED);
    const [gridPressed, setGridPressed] = useState(NOTHING_PRESSED);
    const [driftPxPerSecond, setDriftPxPerSecond] = useState(WraparoundKnobs.STARTING_DRIFT_PX_PER_SECOND);
    const [driftDegrees, setDriftDegrees] = useState(WRAPAROUND_DEFAULTS.driftDegrees);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const marqueePlayingState = useState(true);

    const examples = [
        {
            key: "mosaic",
            span: 2,
            name: "A mosaic that never ends",
            readout: () =>
                `opened: ${mosaicPressed} — drag and let go to send it coasting, or use the wheel; with the window focused the arrows and page keys move it and Home brings it back, and tabbing into the pictures brings the one focused into view`,
            component: () => <MosaicExample onPress={setMosaicPressed} />,
            path: `${EXAMPLES_ROOT}/Mosaic.tsx`,
        },
        {
            key: "grid",
            span: 2,
            name: "Content smaller than the window",
            readout: () =>
                `pressed: ${gridPressed} — six buttons, copied until the window is full; only one set can be tabbed to or read out, and pressing any copy presses the real button`,
            component: () => <GridExample onPress={setGridPressed} />,
            path: `${EXAMPLES_ROOT}/Grid.tsx`,
        },
        {
            key: "marquee",
            span: 2,
            name: "Marquee",
            readout: () =>
                prefersReducedMotion
                    ? "reduced motion is on, so the strip stays still"
                    : `${marqueePlayingState[0] ? "drifting" : "paused"} — the strip moves by itself and holds while the pointer is over it; Pause stops it, and since it cannot be moved by hand, the wheel over it scrolls the page`,
            component: () => (
                <MarqueeExample
                    driftPxPerSecond={prefersReducedMotion ? NO_DRIFT_PX_PER_SECOND : driftPxPerSecond}
                    driftDegrees={driftDegrees}
                    playback={marqueePlayingState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Marquee.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"driftPxPerSecond"}
                    label={"Marquee speed (px/s)"}
                    hint={
                        "How far the marquee's strip drifts in a second. It is off while the visitor has asked for reduced motion."
                    }
                >
                    <PageNumberField
                        value={driftPxPerSecond}
                        min={WraparoundKnobs.MIN_DRIFT_PX_PER_SECOND}
                        max={WraparoundKnobs.MAX_DRIFT_PX_PER_SECOND}
                        step={WraparoundKnobs.DRIFT_STEP_PX_PER_SECOND}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Marquee speed in pixels per second"}
                        onInput={setDriftPxPerSecond}
                    />
                </PageProp>

                <PageProp
                    itemKey={"driftDegrees"}
                    label={"Marquee direction (°)"}
                    hint={
                        "Which way the marquee's strip drifts: 0 is to the right, 90 down, 180 to the left and 270 up."
                    }
                >
                    <PageNumberField
                        value={driftDegrees}
                        min={WraparoundKnobs.MIN_DRIFT_DEGREES}
                        max={WraparoundKnobs.MAX_DRIFT_DEGREES}
                        step={WraparoundKnobs.DRIFT_STEP_DEGREES}
                        ariaLabel={"Marquee direction in degrees"}
                        onInput={setDriftDegrees}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
