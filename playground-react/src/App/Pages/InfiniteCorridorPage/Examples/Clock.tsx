import { useEffect, useState } from "react";

import { Button, InfiniteCorridor, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageReact.types";
import { Room } from "./Room";

type Props = InfiniteCorridorExampleProps;

export const ClockExample = (props: Props) => {
    const [progress, setProgress] = useState(0);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isWalking, setIsWalking] = useState(!prefersReducedMotion);

    const [lapMs, setLapMs] = useState(props.startingLapMs);
    const [followedStartingLapMs, setFollowedStartingLapMs] = useState(props.startingLapMs);

    if (props.startingLapMs !== followedStartingLapMs) {
        setFollowedStartingLapMs(props.startingLapMs);
        setLapMs(props.startingLapMs);
    }

    useEffect(() => {
        if (!isWalking) return;

        let frameId: number;
        let lastMs = performance.now();

        const walk = () => {
            const nowMs = performance.now();

            setProgress((previous) => (previous + (nowMs - lastMs) / lapMs) % 1);
            lastMs = nowMs;
            frameId = requestAnimationFrame(walk);
        };

        frameId = requestAnimationFrame(walk);

        return () => cancelAnimationFrame(frameId);
    }, [isWalking, lapMs]);

    return (
        <>
            <div className={styles.stage}>
                <div className={styles.frame}>
                    <InfiniteCorridor
                        items={props.items}
                        layout={props.layout}
                        progress={[progress, setProgress]}
                        glideDurationMs={props.glideDurationMs}
                        ariaLabel={"Walking corridor"}
                        renderItem={(name, state) => <Room name={name} state={state} />}
                    />
                </div>

                <Button
                    id={"corridorWalk"}
                    ariaLabel={isWalking ? "Pause" : "Walk"}
                    renderContent={(flags) => (
                        <PageControlButtonContent
                            flags={flags}
                            glyph={isWalking ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                        />
                    )}
                    onClick={() => {
                        setIsWalking(!isWalking);
                    }}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"lapMs"}
                    label={"Lap (ms)"}
                    hint={
                        "How long the clock takes to walk the whole corridor once, past every room and back to the first."
                    }
                >
                    <PageNumberField
                        value={lapMs}
                        resetValue={props.startingLapMs}
                        min={InfiniteCorridorKnobs.MIN_LAP_MS}
                        max={InfiniteCorridorKnobs.MAX_LAP_MS}
                        step={InfiniteCorridorKnobs.LAP_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Lap duration in milliseconds"}
                        onInput={setLapMs}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
