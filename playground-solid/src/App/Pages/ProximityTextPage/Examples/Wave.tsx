import { createEffect, createSignal, onCleanup } from "solid-js";

import { Button, MediaQueryMonitorSolidUtils, ProximityText } from "@thewaver/ss-components-solid";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";
import type { ProximityTextExampleProps } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.types";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

const MIDDLE = 0.5;
const OVERSHOOT = 0.4;

type Props = ProximityTextExampleProps;

export const WaveExample = (props: Props) => {
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsMoving, setIsMoving] = createSignal(!getPrefersReducedMotion());
    const [getX, setX] = createSignal(-OVERSHOOT);

    createEffect(() => {
        if (!getIsMoving()) return;

        let frameId: number;
        let lastMs = performance.now();

        const move = () => {
            const nowMs = performance.now();
            const span = 1 + OVERSHOOT * 2;

            setX(
                (x) =>
                    ((x + OVERSHOOT + ((nowMs - lastMs) / ProximityTextKnobs.WAVE_LAP_MS) * span) % span) - OVERSHOOT,
            );
            lastMs = nowMs;
            frameId = requestAnimationFrame(move);
        };

        frameId = requestAnimationFrame(move);

        onCleanup(() => cancelAnimationFrame(frameId));
    });

    return (
        <div class={styles.stack}>
            <div class={styles.variableText}>
                <ProximityText
                    reachPx={props.reachPx}
                    isDisabled={props.isDisabled}
                    pointSource={() => ({ ratio: { x: getX(), y: MIDDLE } })}
                >
                    A wave of weight rolls through this line
                </ProximityText>
            </div>

            <Button
                id={"waveMove"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>{getIsMoving() ? "Stop" : "Move"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsMoving((isMoving) => !isMoving);
                }}
            />
        </div>
    );
};
