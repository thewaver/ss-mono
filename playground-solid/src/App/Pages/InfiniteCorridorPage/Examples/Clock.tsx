import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { Button, InfiniteCorridor, MediaQueryMonitorSolidUtils, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { createSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorClockExampleProps } from "../InfiniteCorridorPageSolid.types";
import { Room } from "./Room";

type Props = InfiniteCorridorClockExampleProps;

export const ClockExample = (props: Props) => {
    const [getProgress, setProgress] = createSignal(0);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsWalking, setIsWalking] = createSignal(!getPrefersReducedMotion());

    createEffect(() => {
        if (!getIsWalking()) return;

        const lapMs = access(props.lapMs);

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

    const getSpinDegrees = createSpinDegrees(() => access(props.spinDegreesPerSecond), getIsWalking);

    const getLayout = createMemo(() => props.toLayout(getSpinDegrees()));

    return (
        <div class={styles.stage}>
            <div class={styles.frame}>
                <InfiniteCorridor
                    items={props.items}
                    layout={getLayout()}
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
    );
};
