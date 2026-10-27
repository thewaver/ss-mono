import { useRef } from "react";

import { ElementObserverReactUtils, MediaQueryMonitorReactUtils, Typewriter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

const TEXT =
    "Scroll this past the middle of the box and it comes apart line by line: the first half flies off to the left, the second to the right, and back again on the way down.";
const FLY_BAND_PX = 80;
const CHARACTER_DELAY_MS = 40;
const CHARACTER_DURATION_MS = 500;
const HALF = 0.5;

const IGNORE = () => undefined;

export const OutwardExample = () => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    ElementObserverReactUtils.useScrollContainerProgress(ref, boxRef);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const flown = TypewriterPageUtils.computeMiddleLineShare(
        boxRef.current ?? undefined,
        ref.current ?? undefined,
        FLY_BAND_PX,
    );

    const computeAnimationName = (_character: string, index: number, count: number) => {
        if (prefersReducedMotion) return styles.typewriterFadeOut;

        return index < count * HALF ? styles.typewriterFlyLeft : styles.typewriterFlyRight;
    };

    return (
        <div ref={boxRef} id={"outwardScrollBox"} className={styles.scrollBox}>
            <div ref={ref} className={styles.scrollParagraph}>
                <Typewriter
                    progress={[flown, IGNORE]}
                    playback={[false, IGNORE]}
                    computeAnimationName={computeAnimationName}
                    animationDelayMs={CHARACTER_DELAY_MS}
                    animationDurationMs={CHARACTER_DURATION_MS}
                >
                    {TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
