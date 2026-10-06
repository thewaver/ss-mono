import { useEffect, useState } from "react";

import { Button, MediaQueryMonitorReactUtils, ProximityText } from "@thewaver/ss-components-react";
import { ProximityTextKnobs } from "@thewaver/ss-playground/App/Knobs/ProximityTexts.const";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
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
            <PageMeasureBox width={ProximityTextKnobs.BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                <div className={styles.variableText}>
                    <ProximityText
                        reachPx={props.reachPx}
                        isDisabled={props.isDisabled}
                        pointSource={{ ratio: { x, y: MIDDLE } }}
                    >
                        A wave of weight rolls through this line
                    </ProximityText>
                </div>
            </PageMeasureBox>

            <Button
                id={"waveMove"}
                ariaLabel={isMoving ? "Pause" : "Move"}
                renderContent={(flags) => (
                    <PageControlButtonContent
                        flags={flags}
                        glyph={isMoving ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                    />
                )}
                onClick={() => {
                    setIsMoving(!isMoving);
                }}
            />
        </div>
    );
};
