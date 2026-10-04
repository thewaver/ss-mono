import { useRef } from "react";

import {
    ElementObserverReactUtils,
    MediaQueryMonitorReactUtils,
    ScrambleTextWeights,
    Typewriter,
} from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

const TEXT = "Scroll me past the middle";
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
                    computeCharacterWeights={ScrambleTextWeights.SAMPLE_WEIGHTS.fromMiddle}
                    animationDelayMs={CHARACTER_DELAY_MS}
                    animationDurationMs={CHARACTER_DURATION_MS}
                >
                    {TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
