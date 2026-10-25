import { createSignal, onCleanup } from "solid-js";

import { Button } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

export const RepeatingDocsExample = () => {
    const [getCount, setCount] = createSignal(0);

    let repeatTimer: ReturnType<typeof setTimeout> | undefined;
    let isPointerPress = false;

    const step = (by: number) => setCount((count) => count + by);

    const stopRepeating = () => {
        clearTimeout(repeatTimer);
    };

    const repeat = (by: number, waitMs: number) => {
        repeatTimer = setTimeout(() => {
            step(by);
            repeat(by, REPEAT_INTERVAL_MS);
        }, waitMs);
    };

    onCleanup(stopRepeating);

    const renderStepButton = (ariaLabel: string, glyph: string, by: number) => (
        <Button
            ariaLabel={ariaLabel}
            renderContent={(getFlags) => <PageControlButtonContent flags={getFlags} glyph={glyph} />}
            onPointerDown={() => {
                isPointerPress = true;
                step(by);
                repeat(by, REPEAT_DELAY_MS);
            }}
            onPointerUp={(e) => {
                stopRepeating();

                if (e.type === "pointercancel") isPointerPress = false;
            }}
            onMouseLeave={() => {
                stopRepeating();
                isPointerPress = false;
            }}
            onClick={() => {
                if (isPointerPress) {
                    isPointerPress = false;

                    return;
                }

                step(by);
            }}
        />
    );

    return (
        <div class={styles.counter}>
            {renderStepButton("Decrease", "▼", -1)}

            <div class={styles.counterValue}>{getCount()}</div>

            {renderStepButton("Increase", "▲", 1)}
        </div>
    );
};
