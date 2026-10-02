import { useEffect, useRef, useState } from "react";

import { Button, MediaQueryMonitorReactUtils, Typewriter } from "@thewaver/ss-components-react";
import type { TypewriterMode } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { TypewriterPhrasesExampleProps } from "../TypewriterPage.types";

const LEAD = "We build";
const PHRASES = ["websites", "apps", "games"];
const FIRST_PHRASE = 0;
const HOLD_MS = 1600;
const CHARACTER_DELAY_MS = 80;
const CHARACTER_DURATION_MS = 200;
const NO_MOTION_MS = 0;

type Props = TypewriterPhrasesExampleProps;

export const PhrasesExample = (props: Props) => {
    const [phraseIndex, setPhraseIndex] = useState(FIRST_PHRASE);
    const [mode, setMode] = useState<TypewriterMode>("type");
    const [isPaused, setIsPaused] = useState(false);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const modeRef = useRef(mode);
    const isPausedRef = useRef(isPaused);
    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const isStepWaitingRef = useRef(false);

    useEffect(() => () => clearTimeout(holdTimeoutRef.current), []);

    const changeMode = (next: TypewriterMode) => {
        modeRef.current = next;
        setMode(next);
    };

    const step = () => {
        isStepWaitingRef.current = false;

        if (modeRef.current === "type") {
            changeMode("erase");

            return;
        }

        setPhraseIndex((index) => (index + 1) % PHRASES.length);
        changeMode("type");
    };

    const requestStep = () => {
        if (isPausedRef.current) {
            isStepWaitingRef.current = true;

            return;
        }

        step();
    };

    const handleAnimationEnd = () => {
        clearTimeout(holdTimeoutRef.current);

        if (modeRef.current === "erase") {
            requestStep();

            return;
        }

        holdTimeoutRef.current = setTimeout(requestStep, HOLD_MS);
    };

    const togglePause = () => {
        const isNowPaused = !isPausedRef.current;

        isPausedRef.current = isNowPaused;
        setIsPaused(isNowPaused);

        if (!isNowPaused && isStepWaitingRef.current) step();
    };

    return (
        <div className={styles.phraseStack}>
            <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
                <div className={styles.phraseLine}>
                    <span>{LEAD}</span>

                    <div className={styles.phraseSlot}>
                        <Typewriter
                            mode={mode}
                            animationName={props.animationName}
                            animationDelayMs={prefersReducedMotion ? NO_MOTION_MS : CHARACTER_DELAY_MS}
                            animationDurationMs={prefersReducedMotion ? NO_MOTION_MS : CHARACTER_DURATION_MS}
                            computeCharacterWeights={props.computeCharacterWeights}
                            renderCaret={() => (
                                <span
                                    className={[
                                        styles.phraseCaret,
                                        !isPaused && !prefersReducedMotion && styles.phraseCaretBlinking,
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    aria-hidden="true"
                                />
                            )}
                            onAnimationEnd={handleAnimationEnd}
                        >
                            {PHRASES[phraseIndex]}
                        </Typewriter>
                    </div>
                </div>
            </PageMeasureBox>

            <Button
                id={"pausePhrases"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isPaused ? "Resume" : "Pause"}</PageButtonContent>
                )}
                onClick={() => {
                    togglePause();
                }}
            />
        </div>
    );
};
