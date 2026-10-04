import { createSignal } from "solid-js";

import {
    ElementObserverSolidUtils,
    MediaQueryMonitorSolidUtils,
    ScrambleTextWeights,
    Typewriter,
} from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { MathUtils } from "@thewaver/ss-utils";

const TEXT = "Scroll me past the middle";
const FLY_FROM = 0.4;
const FLY_SPAN = 0.25;
const CHARACTER_DELAY_MS = 40;
const CHARACTER_DURATION_MS = 500;
const HALF = 0.5;

export const OutwardExample = () => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getTravel = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRef, getBoxRef);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getFlown = () => MathUtils.clamp01((getTravel() - FLY_FROM) / FLY_SPAN);

    const computeAnimationName = (_character: string, index: number, count: number) => {
        if (getPrefersReducedMotion()) return styles.typewriterFadeOut;

        return index < count * HALF ? styles.typewriterFlyLeft : styles.typewriterFlyRight;
    };

    return (
        <div ref={setBoxRef} id={"outwardScrollBox"} class={styles.scrollBox}>
            <div ref={setRef} class={styles.scrollParagraph}>
                <Typewriter
                    progress={[getFlown, () => undefined]}
                    playback={[() => false, () => undefined]}
                    computeAnimationName={computeAnimationName}
                    computeCharacterWeights={ScrambleTextWeights.SAMPLE_WEIGHTS.fromMiddle}
                    animationDelayMs={() => CHARACTER_DELAY_MS}
                    animationDurationMs={() => CHARACTER_DURATION_MS}
                >
                    {TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
