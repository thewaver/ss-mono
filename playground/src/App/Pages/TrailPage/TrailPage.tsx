import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitorUtils, TRAIL_DEFAULTS } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { CircuitExample } from "./Examples/Circuit";
import { TimelineExample } from "./Examples/Timeline";
import type { TrailExampleProps } from "./TrailPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TrailPage/Examples";

const MIN_DURATION_MS = 500;
const MAX_DURATION_MS = 20000;
const DURATION_STEP_MS = 500;
const PERCENT = 100;
const HALF_WAY = 0.5;

export const TrailPage = () => {
    const [getDurationMs, setDurationMs] = createSignal(TRAIL_DEFAULTS.durationMs);
    const [getIsLooping, setIsLooping] = createSignal(true);
    const [getIsTurning, setIsTurning] = createSignal(true);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

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
                    <CircuitExample
                        {...commonProps}
                        progressSignal={circuitProgressSignal}
                        isPlayingSignal={circuitPlayingSignal}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Circuit.tsx`,
            },
            {
                key: "timeline",
                name: "Timeline",
                readout: () =>
                    `${getPercent(timelineProgressSignal[0]())} along the path — nothing is running, the slider is what puts the marker there`,
                component: () => (
                    <TimelineExample
                        {...commonProps}
                        progressSignal={timelineProgressSignal}
                        isPlayingSignal={timelinePlayingSignal}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Timeline.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"durationMs"}
                    label={"Lap duration (ms)"}
                    hint={"How long the traveller takes to walk the path once, end to end."}
                >
                    <PageNumberField
                        value={getDurationMs}
                        min={() => MIN_DURATION_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
                        ariaLabel={"Lap duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"isLooping"}
                    label={"Loops"}
                    hint={"Sends the traveller round again as soon as it reaches the end, instead of stopping there."}
                >
                    <PageCheckField value={getIsLooping} ariaLabel={"Loops"} onChange={setIsLooping} />
                </PageProp>

                <PageProp
                    key={"isTurning"}
                    label={"Faces along the path"}
                    hint={
                        "Turns the traveller to point the way it is going, instead of leaving it upright the whole way round."
                    }
                >
                    <PageCheckField value={getIsTurning} ariaLabel={"Faces along the path"} onChange={setIsTurning} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
