import { useRef } from "react";

import { ElementObserverReactUtils, Typewriter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { MathUtils } from "@thewaver/ss-utils";

const TEXT =
    "Every word here waits, dimmed, until the paragraph is scrolled into view, then lights up in reading order as it travels up the box — and dims again on the way back down.";
const LIT_FROM = 0.15;
const LIT_SPAN = 0.35;
const CHARACTER_DELAY_MS = 30;
const CHARACTER_DURATION_MS = 400;

const IGNORE = () => undefined;

export const ScrollLitExample = () => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    const travel = ElementObserverReactUtils.useScrollContainerProgress(ref, boxRef);

    const lit = MathUtils.clamp01((travel - LIT_FROM) / LIT_SPAN);

    return (
        <div ref={boxRef} id={"scrollLitScrollBox"} className={styles.scrollBox}>
            <div ref={ref} className={styles.scrollParagraph}>
                <Typewriter
                    progress={[lit, IGNORE]}
                    playback={[false, IGNORE]}
                    computeAnimationName={() => styles.typewriterLight}
                    animationDelayMs={CHARACTER_DELAY_MS}
                    animationDurationMs={CHARACTER_DURATION_MS}
                >
                    {TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
