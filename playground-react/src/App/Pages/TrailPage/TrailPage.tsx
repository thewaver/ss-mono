import { useState } from "react";

import { MediaQueryMonitorReactUtils, TRAIL_DEFAULTS } from "@thewaver/ss-components-react";
import { TrailKnobs } from "@thewaver/ss-playground/App/Knobs/Trails.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { CircuitExample } from "./Examples/Circuit";
import { ConvoyExample } from "./Examples/Convoy";
import { ScrollExample } from "./Examples/Scroll";
import { TimelineExample } from "./Examples/Timeline";
import type { TrailExampleProps } from "./TrailPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TrailPage/Examples";

const PERCENT = 100;
const HALF_WAY = 0.5;

export const TrailPage = () => {
    const [durationMs, setDurationMs] = useState(TRAIL_DEFAULTS.durationMs);
    const [isLooping, setIsLooping] = useState(TrailKnobs.STARTING_IS_LOOPING);
    const [isTurning, setIsTurning] = useState(TrailKnobs.STARTING_IS_TURNING);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const circuitProgressState = useState(0);
    const circuitPlayingState = useState(!prefersReducedMotion);
    const timelineProgressState = useState(HALF_WAY);
    const timelinePlayingState = useState(false);
    const convoyProgressState = useState(0);
    const convoyPlayingState = useState(!prefersReducedMotion);
    const [scrollProgress, setScrollProgress] = useState(0);

    const getPercent = (progress: number) => `${Math.round(progress * PERCENT)}%`;

    const commonProps: Omit<TrailExampleProps, "progress" | "playback"> = {
        durationMs,
        isLooping,
        isTurning,
    };

    const examples = [
        {
            key: "circuit",
            name: "Circuit",
            readout: () =>
                `${getPercent(circuitProgressState[0])} round the loop, ${circuitPlayingState[0] ? "running" : "stopped"} — the playback signal starts and stops it, and the controller sends it back to the start`,
            component: () => (
                <CircuitExample
                    {...commonProps}
                    progress={circuitProgressState}
                    playback={circuitPlayingState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Circuit.tsx`,
        },
        {
            key: "timeline",
            name: "Timeline",
            readout: () =>
                `${getPercent(timelineProgressState[0])} along the path — nothing is running, the slider is what puts the marker there`,
            component: () => (
                <TimelineExample
                    {...commonProps}
                    progress={timelineProgressState}
                    playback={timelinePlayingState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Timeline.tsx`,
        },
        {
            key: "convoy",
            name: "Convoy",
            readout: () =>
                `${getPercent(convoyProgressState[0])} of the run, ${convoyPlayingState[0] ? "running" : "stopped"} — four travelers on one clock, each a share of the path behind the one in front; with looping off they wait at the start and the run ends when the last one arrives`,
            component: () => (
                <ConvoyExample
                    {...commonProps}
                    progress={convoyProgressState}
                    playback={convoyPlayingState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Convoy.tsx`,
        },
        {
            key: "scroll",
            name: "Driven by scrolling",
            readout: () =>
                prefersReducedMotion
                    ? "reduced motion is on, so the marker stays at the start instead of following the scroll"
                    : `${getPercent(scrollProgress)} of the way through the box — nothing is running, scrolling the box is what moves the marker`,
            component: () => (
                <ScrollExample
                    {...commonProps}
                    isFollowing={!prefersReducedMotion}
                    onProgressChange={setScrollProgress}
                />
            ),
            path: `${EXAMPLES_ROOT}/Scroll.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"durationMs"}
                    label={"Lap duration (ms)"}
                    hint={"How long the traveler takes to walk the path once, end to end."}
                >
                    <PageNumberField
                        value={durationMs}
                        min={TrailKnobs.MIN_DURATION_MS}
                        max={TrailKnobs.MAX_DURATION_MS}
                        step={TrailKnobs.DURATION_STEP_MS}
                        ariaLabel={"Lap duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isLooping"}
                    label={"Loops"}
                    hint={"Sends the traveler round again as soon as it reaches the end, instead of stopping there."}
                >
                    <PageCheckField value={isLooping} ariaLabel={"Loops"} onChange={setIsLooping} />
                </PageProp>

                <PageProp
                    itemKey={"isTurning"}
                    label={"Faces along the path"}
                    hint={
                        "Turns the traveler to point the way it is going, instead of leaving it upright the whole way round."
                    }
                >
                    <PageCheckField value={isTurning} ariaLabel={"Faces along the path"} onChange={setIsTurning} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
