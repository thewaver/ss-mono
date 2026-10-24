import { For, createSignal, onCleanup } from "solid-js";

import { MediaQueryMonitorSolidUtils, SlideButton } from "@thewaver/ss-components-solid";
import {
    FINALE_CYCLE_MS,
    FINALE_PAUSE_MS,
    LOCK_COUNT,
    TURN_DEG,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.css";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageSlideButtonContent } from "../../../StyledComponents/SlideButtonContent/SlideButtonContent";
import type { SlideButtonArmingExampleProps } from "../SlideButtonPageSolid.types";

type Props = SlideButtonArmingExampleProps;

const LOCKS = Array.from({ length: LOCK_COUNT }, (_, index) => index);

const NONE_ARMED = LOCKS.map(() => false);

export const ArmingExample = (props: Props) => {
    const progressSignals = LOCKS.map(() => createSignal(0));
    const [getArmed, setArmed] = createSignal(NONE_ARMED);
    const [getIsFinale, setIsFinale] = createSignal(false);
    const [getFinaleRatio, setFinaleRatio] = createSignal(0);
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let cycleFrame: number | undefined;

    onCleanup(() => {
        clearTimeout(resetTimer);
        cancelAnimationFrame(cycleFrame ?? 0);
    });

    const cycle = (startedAt: number) => {
        cycleFrame = requestAnimationFrame((now) => {
            const ratio = Math.min(1, (now - startedAt) / FINALE_CYCLE_MS);

            setFinaleRatio(ratio);

            if (ratio < 1) cycle(startedAt);
        });
    };

    const reset = () => {
        setIsFinale(false);
        setFinaleRatio(0);
        setArmed(NONE_ARMED);
        props.onArmedCountChange(0);
    };

    const arm = (lock: number) => {
        if (getArmed()[lock] || getIsFinale()) return;

        const next = getArmed().map((isArmed, index) => isArmed || index === lock);

        setArmed(next);
        props.onArmedCountChange(next.filter(Boolean).length);

        if (!next.every(Boolean)) return;

        const isCycling = !getPrefersReducedMotion();

        setIsFinale(true);

        if (isCycling) cycle(performance.now());

        resetTimer = setTimeout(reset, (isCycling ? FINALE_CYCLE_MS : 0) + FINALE_PAUSE_MS);
    };

    const getTurn = (lock: number) => (getArmed()[lock] ? 1 : progressSignals[lock][0]()) * TURN_DEG;

    return (
        <PageControlColumn>
            <For each={LOCKS}>
                {(lock) => (
                    <div
                        class={styles.lock}
                        classList={{ [styles.isArmed]: getArmed()[lock], [styles.isFinale]: getIsFinale() }}
                        style={assignInlineVars({
                            [styles.turnVar]: String(getTurn(lock)),
                            [styles.liftVar]: String(getFinaleRatio()),
                        })}
                    >
                        <SlideButton
                            ariaLabel={`Lock ${lock + 1}`}
                            ariaDescription={"Hold Enter or Space to arm."}
                            isPressed={() => getArmed()[lock]}
                            progress={progressSignals[lock]}
                            thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                            renderContent={(getRenderProps) => (
                                <PageSlideButtonContent renderProps={getRenderProps}>
                                    Slide or hold to arm
                                </PageSlideButtonContent>
                            )}
                            onActivate={() => arm(lock)}
                        />
                    </div>
                )}
            </For>
        </PageControlColumn>
    );
};
