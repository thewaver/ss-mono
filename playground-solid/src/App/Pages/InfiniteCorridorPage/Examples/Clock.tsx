import { createEffect, createSignal, on, onCleanup } from "solid-js";

import { Button, InfiniteCorridor, MediaQueryMonitorSolidUtils, access } from "@thewaver/ss-components-solid";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageSolid.types";
import { Room } from "./Room";

type Props = InfiniteCorridorExampleProps;

export const ClockExample = (props: Props) => {
    const [getProgress, setProgress] = createSignal(0);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsWalking, setIsWalking] = createSignal(!getPrefersReducedMotion());

    const [getLapMs, setLapMs] = createSignal(access(props.startingLapMs));

    createEffect(on(() => access(props.startingLapMs), setLapMs, { defer: true }));

    createEffect(() => {
        if (!getIsWalking()) return;

        const lapMs = getLapMs();

        let frameId: number;
        let lastMs = performance.now();

        const walk = () => {
            const nowMs = performance.now();

            setProgress((progress) => (progress + (nowMs - lastMs) / lapMs) % 1);
            lastMs = nowMs;
            frameId = requestAnimationFrame(walk);
        };

        frameId = requestAnimationFrame(walk);

        onCleanup(() => cancelAnimationFrame(frameId));
    });

    return (
        <>
            <div class={styles.stage}>
                <div class={styles.frame}>
                    <InfiniteCorridor
                        items={props.items}
                        layout={props.layout}
                        progress={[getProgress, setProgress]}
                        glideDurationMs={props.glideDurationMs}
                        ariaLabel={"Walking corridor"}
                        renderItem={(getName, getState) => <Room name={getName} state={getState} />}
                    />
                </div>

                <Button
                    id={"corridorWalk"}
                    ariaLabel={() => (getIsWalking() ? "Pause" : "Walk")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getIsWalking() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={() => {
                        setIsWalking((isWalking) => !isWalking);
                    }}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    key={"lapMs"}
                    label={"Lap (ms)"}
                    hint={
                        "How long the clock takes to walk the whole corridor once, past every room and back to the first."
                    }
                >
                    <PageNumberField
                        value={getLapMs}
                        resetValue={() => access(props.startingLapMs)}
                        min={() => InfiniteCorridorKnobs.MIN_LAP_MS}
                        max={() => InfiniteCorridorKnobs.MAX_LAP_MS}
                        step={() => InfiniteCorridorKnobs.LAP_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Lap duration in milliseconds"}
                        onInput={setLapMs}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
