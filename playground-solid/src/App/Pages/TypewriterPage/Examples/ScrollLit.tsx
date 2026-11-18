import { createSignal } from "solid-js";

import { ElementObserverSolidUtils, Typewriter } from "@thewaver/ss-components-solid";
import { SCROLL_LIT_TEXT } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { TypewriterPageUtils } from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.utils";

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
                    animationDelayMs={CHARACTER_DELAY_MS}
                    animationDurationMs={CHARACTER_DURATION_MS}
                >
                    {SCROLL_LIT_TEXT}
                </Typewriter>
            </div>
        </div>
    );
};
