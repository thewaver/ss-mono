import { useEffect, useState } from "react";

import { Button, MediaQueryMonitorReactUtils, ProximityText } from "@thewaver/ss-components-react";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ProximityTextExampleProps } from "../ProximityTextPageReact.types";

const MIDDLE = 0.5;
const OVERSHOOT = 0.4;

type Props = ProximityTextExampleProps;

export const WaveExample = (props: Props) => {
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isMoving, setIsMoving] = useState(!prefersReducedMotion);
    const [x, setX] = useState(-OVERSHOOT);

    useEffect(() => {
        if (!isMoving) return;

        let frameId: number;
        let lastMs = performance.now();

        const move = () => {
            const nowMs = performance.now();
            const span = 1 + OVERSHOOT * 2;
            const step = ((nowMs - lastMs) / ProximityTextKnobs.WAVE_LAP_MS) * span;

            setX((previous) => ((previous + OVERSHOOT + step) % span) - OVERSHOOT);
            lastMs = nowMs;
            frameId = requestAnimationFrame(move);
        };

        frameId = requestAnimationFrame(move);

        return () => cancelAnimationFrame(frameId);
    }, [isMoving]);

    return (
        <div className={styles.stack}>
            <div className={styles.variableText}>
                <ProximityText
                    reachPx={props.reachPx}
                    isDisabled={props.isDisabled}
                    pointSource={{ ratio: { x, y: MIDDLE } }}
                >
                    A wave of weight rolls through this line
                </ProximityText>
            </div>

            <Button
                id={"waveMove"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isMoving ? "Stop" : "Move"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsMoving(!isMoving);
                }}
            />
        </div>
    );
};
