import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { CircuitExample } from "./Examples/Circuit";
import { TimelineExample } from "./Examples/Timeline";
import type { TrailExampleProps } from "./TrailPage.types";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";

const EXAMPLES_ROOT = "/src/App/Pages/TrailPage/Examples";

const MIN_DURATION_MS = 500;
const MAX_DURATION_MS = 20000;
const DURATION_STEP_MS = 500;
const STARTING_DURATION_MS = 6000;
const PERCENT = 100;
const HALF_WAY = 0.5;

export const TrailPage = () => {
    const [getDurationMs, setDurationMs] = createSignal(STARTING_DURATION_MS);
    const [getIsLooping, setIsLooping] = createSignal(true);
    const [getIsTurning, setIsTurning] = createSignal(true);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const circuitProgressSignal = createSignal(0);
    const circuitPlayingSignal = createSignal(!getPrefersReducedMotion());
    const timelineProgressSignal = createSignal(HALF_WAY);
    const timelinePlayingSignal = createSignal(false);

    const getPercent = (progress: number) => `${Math.round(progress * PERCENT)}%`;

    const getExamples = createMemo(() => {
        const commonProps: Omit<TrailExampleProps, "progressSignal" | "isPlayingSignal"> = {
            durationMs: getDurationMs,
            isLooping: getIsLooping,
            isTurning: getIsTurning,
        };

        return [
            {
                key: "circuit",
                name: "Circuit",
                readout: () =>
                    `${getPercent(circuitProgressSignal[0]())} round the loop, ${circuitPlayingSignal[0]() ? "running" : "stopped"} — the controller starts it, stops it and sends it back to the start`,
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                        <CircuitExample
                            {...commonProps}
                            progressSignal={circuitProgressSignal}
                            isPlayingSignal={circuitPlayingSignal}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Circuit.tsx`,
            },
            {
                key: "timeline",
                name: "Timeline",
                readout: () =>
                    `${getPercent(timelineProgressSignal[0]())} along the path — nothing is running, the slider is what puts the marker there`,
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                        <TimelineExample
                            {...commonProps}
                            progressSignal={timelineProgressSignal}
                            isPlayingSignal={timelinePlayingSignal}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Timeline.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"durationMs"} label={"Lap duration (ms)"}>
                    <PageNumberField
                        value={getDurationMs}
                        min={() => MIN_DURATION_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
                        ariaLabel={"Lap duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp key={"isLooping"} label={"Loops"}>
                    <PageCheckField value={getIsLooping} ariaLabel={"Loops"} onChange={setIsLooping} />
                </PageProp>

                <PageProp key={"isTurning"} label={"Faces along the path"}>
                    <PageCheckField value={getIsTurning} ariaLabel={"Faces along the path"} onChange={setIsTurning} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
