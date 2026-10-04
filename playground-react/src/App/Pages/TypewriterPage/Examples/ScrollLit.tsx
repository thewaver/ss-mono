import { useRef } from "react";

import { ElementObserverReactUtils, Typewriter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

const TEXT =
    "Every word here waits, dimmed, until it reaches the middle of the box, then lights up in reading order as it passes — and dims again on the way back down.";
const LIT_BAND_PX = 24;
const CHARACTER_DELAY_MS = 30;
const CHARACTER_DURATION_MS = 400;

const IGNORE = () => undefined;

export const ScrollLitExample = () => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    ElementObserverReactUtils.useScrollContainerProgress(ref, boxRef);

    const lit = TypewriterPageUtils.computeMiddleLineShare(
        boxRef.current ?? undefined,
        ref.current ?? undefined,
        LIT_BAND_PX,
    );

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
