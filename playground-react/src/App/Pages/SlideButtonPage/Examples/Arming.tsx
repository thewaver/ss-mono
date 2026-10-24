import { useEffect, useRef, useState } from "react";

import { MediaQueryMonitorReactUtils, SlideButton } from "@thewaver/ss-components-react";
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
import type { SlideButtonArmingExampleProps } from "../SlideButtonPageReact.types";

type Props = SlideButtonArmingExampleProps;

const LOCKS = Array.from({ length: LOCK_COUNT }, (_, index) => index);

const NONE_ARMED = LOCKS.map(() => false);

const AT_REST = LOCKS.map(() => 0);

export const ArmingExample = (props: Props) => {
    const [progresses, setProgresses] = useState(AT_REST);
    const [armed, setArmed] = useState(NONE_ARMED);
    const [isFinale, setIsFinale] = useState(false);
    const [finaleRatio, setFinaleRatio] = useState(0);
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const cycleFrameRef = useRef<number>(undefined);
    const onArmedCountChangeRef = useRef(props.onArmedCountChange);

    onArmedCountChangeRef.current = props.onArmedCountChange;

    useEffect(
        () => () => {
            clearTimeout(resetTimerRef.current);
            cancelAnimationFrame(cycleFrameRef.current ?? 0);
        },
        [],
    );

    const cycle = (startedAt: number) => {
        cycleFrameRef.current = requestAnimationFrame((now) => {
            const ratio = Math.min(1, (now - startedAt) / FINALE_CYCLE_MS);

            setFinaleRatio(ratio);

            if (ratio < 1) cycle(startedAt);
        });
    };

    const reset = () => {
        setIsFinale(false);
        setFinaleRatio(0);
        setArmed(NONE_ARMED);
        onArmedCountChangeRef.current(0);
    };

    const arm = (lock: number) => {
        if (armed[lock] || isFinale) return;

        const next = armed.map((isArmed, index) => isArmed || index === lock);

        setArmed(next);
        props.onArmedCountChange(next.filter(Boolean).length);

        if (!next.every(Boolean)) return;

        const isCycling = !prefersReducedMotion;

        setIsFinale(true);

        if (isCycling) cycle(performance.now());

        resetTimerRef.current = setTimeout(reset, (isCycling ? FINALE_CYCLE_MS : 0) + FINALE_PAUSE_MS);
    };

    const setProgress = (lock: number, ratio: number) => {
        setProgresses((prev) => prev.map((progress, index) => (index === lock ? ratio : progress)));
    };

    const computeTurn = (lock: number) => (armed[lock] ? 1 : progresses[lock]) * TURN_DEG;

    return (
        <PageControlColumn>
            {LOCKS.map((lock) => (
                <div
                    key={lock}
                    className={[styles.lock, armed[lock] && styles.isArmed, isFinale && styles.isFinale]
                        .filter(Boolean)
                        .join(" ")}
                    style={assignInlineVars({
                        [styles.turnVar]: String(computeTurn(lock)),
                        [styles.liftVar]: String(finaleRatio),
                    })}
                >
                    <SlideButton
                        ariaLabel={`Lock ${lock + 1}`}
                        ariaDescription={"Hold Enter or Space to arm."}
                        isPressed={armed[lock]}
                        progress={[progresses[lock], (ratio) => setProgress(lock, ratio)]}
                        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
                        renderContent={(renderProps) => (
                            <PageSlideButtonContent renderProps={renderProps}>
                                Slide or hold to arm
                            </PageSlideButtonContent>
                        )}
                        onActivate={() => arm(lock)}
                    />
                </div>
            ))}
        </PageControlColumn>
    );
};
