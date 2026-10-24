import { onCleanup } from "solid-js";

import { Button, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ButtonCounterExampleProps } from "../ButtonPageSolid.types";

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

type Props = ButtonCounterExampleProps;

export const CounterExample = (props: Props) => {
    let repeatTimer: ReturnType<typeof setTimeout> | undefined;
    let isPointerPress = false;

    const stopRepeating = () => {
        clearTimeout(repeatTimer);
    };

    const repeat = (step: number, waitMs: number) => {
        repeatTimer = setTimeout(() => {
            props.onStep(step);
            repeat(step, REPEAT_INTERVAL_MS);
        }, waitMs);
    };

    onCleanup(stopRepeating);

    const renderStepButton = (ariaLabel: string, glyph: string, step: number) => (
        <Button
            ariaLabel={ariaLabel}
            renderContent={(getFlags) => <PageControlButtonContent flags={getFlags} glyph={glyph} />}
            onPointerDown={() => {
                isPointerPress = true;
                props.onStep(step);
                repeat(step, REPEAT_DELAY_MS);
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

                props.onStep(step);
            }}
        />
    );

    return (
        <div class={styles.counter}>
            {renderStepButton("Decrease", "▼", -1)}

            <div class={styles.counterValue}>{access(props.count)}</div>

            {renderStepButton("Increase", "▲", 1)}
        </div>
    );
};
