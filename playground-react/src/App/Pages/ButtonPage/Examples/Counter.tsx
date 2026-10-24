import { useEffect, useRef } from "react";

import { Button } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ButtonCounterExampleProps } from "../ButtonPageReact.types";

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

type Props = ButtonCounterExampleProps;

export const CounterExample = (props: Props) => {
    const repeatTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const isPointerPressRef = useRef(false);
    const onStepRef = useRef(props.onStep);

    onStepRef.current = props.onStep;

    const stopRepeating = () => {
        clearTimeout(repeatTimerRef.current);
    };

    const repeat = (step: number, waitMs: number) => {
        repeatTimerRef.current = setTimeout(() => {
            onStepRef.current(step);
            repeat(step, REPEAT_INTERVAL_MS);
        }, waitMs);
    };

    useEffect(() => stopRepeating, []);

    const renderStepButton = (ariaLabel: string, glyph: string, step: number) => (
        <Button
            ariaLabel={ariaLabel}
            renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={glyph} />}
            onPointerDown={() => {
                isPointerPressRef.current = true;
                props.onStep(step);
                repeat(step, REPEAT_DELAY_MS);
            }}
            onPointerUp={(e) => {
                stopRepeating();

                if (e.type === "pointercancel") isPointerPressRef.current = false;
            }}
            onMouseLeave={() => {
                stopRepeating();
                isPointerPressRef.current = false;
            }}
            onClick={() => {
                if (isPointerPressRef.current) {
                    isPointerPressRef.current = false;

                    return;
                }

                props.onStep(step);
            }}
        />
    );

    return (
        <div className={styles.counter}>
            {renderStepButton("Decrease", "▼", -1)}

            <div className={styles.counterValue}>{props.count}</div>

            {renderStepButton("Increase", "▲", 1)}
        </div>
    );
};
