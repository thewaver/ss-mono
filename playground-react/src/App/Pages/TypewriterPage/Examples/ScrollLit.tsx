import { useRef } from "react";

import { ElementObserverReactUtils, Typewriter } from "@thewaver/ss-components-react";
import { SCROLL_LIT_TEXT } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

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
                    {SCROLL_LIT_TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
