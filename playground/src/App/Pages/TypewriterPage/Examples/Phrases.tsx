import { createSignal, onCleanup } from "solid-js";

import { Button, MediaQueryMonitorUtils, Typewriter } from "@thewaver/ss-components";
import type { TypewriterController, TypewriterMode } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { TypewriterExampleProps } from "../TypewriterPage.types";

import * as styles from "../TypewriterPage.css";

const LEAD = "We build";
const PHRASES = ["websites", "apps", "games"];
const FIRST_PHRASE = 0;
const HOLD_MS = 1600;
const CHARACTER_DELAY_MS = 80;
const CHARACTER_DURATION_MS = 200;
const NO_MOTION_MS = 0;

type Props = TypewriterExampleProps;

export const PhrasesExample = (props: Props) => {
    const [getController, setController] = createSignal<TypewriterController>();
    const [getPhraseIndex, setPhraseIndex] = createSignal(FIRST_PHRASE);
    const [getMode, setMode] = createSignal<TypewriterMode>("type");
    const [getIsPaused, setIsPaused] = createSignal(false);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    let holdTimeout: ReturnType<typeof setTimeout> | undefined;
    let isStepWaiting = false;

    onCleanup(() => {
        clearTimeout(holdTimeout);
    });

    const step = () => {
        isStepWaiting = false;

        if (getMode() === "type") {
            setMode("erase");

            return;
        }

        setPhraseIndex((index) => (index + 1) % PHRASES.length);
        setMode("type");
        getController()?.update("content");
    };

    const requestStep = () => {
        if (getIsPaused()) {
            isStepWaiting = true;

            return;
        }

        step();
    };

    const handleAnimationEnd = () => {
        clearTimeout(holdTimeout);

        if (getMode() === "erase") {
            requestStep();

            return;
        }

        holdTimeout = setTimeout(requestStep, HOLD_MS);
    };

    const togglePause = () => {
        setIsPaused((isPaused) => !isPaused);

        if (!getIsPaused() && isStepWaiting) step();
    };

    return (
        <div class={styles.phraseStack}>
            <div class={styles.phraseLine}>
                <span>{LEAD}</span>

                <div class={styles.phraseSlot}>
                    <Typewriter
                        mode={getMode}
                        animationName={props.animationName}
                        animationDelayMs={() => (getPrefersReducedMotion() ? NO_MOTION_MS : CHARACTER_DELAY_MS)}
                        animationDurationMs={() => (getPrefersReducedMotion() ? NO_MOTION_MS : CHARACTER_DURATION_MS)}
                        computeCharacterWeights={props.computeCharacterWeights}
                        renderCaret={() => (
                            <span
                                class={styles.phraseCaret}
                                classList={{
                                    [styles.phraseCaretBlinking]: !getIsPaused() && !getPrefersReducedMotion(),
                                }}
                                aria-hidden="true"
                            />
                        )}
                        onMount={setController}
                        onAnimationEnd={handleAnimationEnd}
                    >
                        {PHRASES[getPhraseIndex()]}
                    </Typewriter>
                </div>
            </div>

            <Button
                id={"pausePhrases"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>{getIsPaused() ? "Resume" : "Pause"}</PageButtonContent>
                )}
                onClick={() => {
                    togglePause();
                }}
            />
        </div>
    );
};
