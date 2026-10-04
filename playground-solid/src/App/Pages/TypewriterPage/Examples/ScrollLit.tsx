import { createSignal } from "solid-js";

import { ElementObserverSolidUtils, Typewriter } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

const TEXT =
    "Every word here waits, dimmed, until it reaches the middle of the box, then lights up in reading order as it passes — and dims again on the way back down.";
const LIT_BAND_PX = 24;
const CHARACTER_DELAY_MS = 30;
const CHARACTER_DURATION_MS = 400;

export const ScrollLitExample = () => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getTravel = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRef, getBoxRef);

    const getLit = () => {
        getTravel();

        return TypewriterPageUtils.computeMiddleLineShare(getBoxRef(), getRef(), LIT_BAND_PX);
    };

    return (
        <div ref={setBoxRef} id={"scrollLitScrollBox"} class={styles.scrollBox}>
            <div ref={setRef} class={styles.scrollParagraph}>
                <Typewriter
                    progress={[getLit, () => undefined]}
                    playback={[() => false, () => undefined]}
                    computeAnimationName={() => styles.typewriterLight}
                    animationDelayMs={() => CHARACTER_DELAY_MS}
                    animationDurationMs={() => CHARACTER_DURATION_MS}
                >
                    {TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
