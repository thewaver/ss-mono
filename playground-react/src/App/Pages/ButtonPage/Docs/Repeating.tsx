import { useEffect, useRef, useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

export const RepeatingDocsExample = () => {
    const [count, setCount] = useState(0);
    const repeatTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const isPointerPressRef = useRef(false);

    const step = (by: number) => setCount((prev) => prev + by);

    const stopRepeating = () => {
        clearTimeout(repeatTimerRef.current);
    };

    const repeat = (by: number, waitMs: number) => {
        repeatTimerRef.current = setTimeout(() => {
            step(by);
            repeat(by, REPEAT_INTERVAL_MS);
        }, waitMs);
    };

    useEffect(() => stopRepeating, []);

    const renderStepButton = (ariaLabel: string, glyph: string, by: number) => (
        <Button
            ariaLabel={ariaLabel}
            renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={glyph} />}
            onPointerDown={() => {
                isPointerPressRef.current = true;
                step(by);
                repeat(by, REPEAT_DELAY_MS);
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

                step(by);
            }}
        />
    );

    return (
        <div className={styles.counter}>
            {renderStepButton("Decrease", "▼", -1)}

            <div className={styles.counterValue}>{count}</div>

            {renderStepButton("Increase", "▲", 1)}
        </div>
    );
};
