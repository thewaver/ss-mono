import { For, createMemo, createSignal, onCleanup } from "solid-js";

import { InteractionTracker } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

import type { InteractionSwipeExampleProps } from "../InteractionTrackerPage.types";

import * as styles from "../InteractionTrackerPage.css";

const CARDS = ["Ace", "King", "Queen", "Jack"];
const PERCENT = 100;
const NO_PROGRESS = 0;
const TOP_DEPTH = 0;
const MAX_TILT_DEGREES = 18;
const FLY_RATIO = 1.6;
const FLY_TILT_DEGREES = 30;
const FLIGHT_MS = 260;
const REDEAL_MS = 320;
const DEPTH_STEP_PX = 10;
const DEPTH_SHRINK = 0.05;
const FULL_SCALE = 1;
const LEFTWARD = -1;
const RIGHTWARD = 1;

type Props = InteractionSwipeExampleProps;

export const CardStackExample = (props: Props) => {
    const [getRef, setRef] = createSignal<HTMLElement>();
    const [getGoneCount, setGoneCount] = createSignal(0);
    const [getProgress, setProgress] = createSignal(NO_PROGRESS);
    const [getFlyingDirection, setFlyingDirection] = createSignal<SwipeDirection>();

    let flightTimeout: ReturnType<typeof setTimeout> | undefined;
    let redealTimeout: ReturnType<typeof setTimeout> | undefined;

    onCleanup(() => {
        clearTimeout(flightTimeout);
        clearTimeout(redealTimeout);
    });

    const getRemaining = createMemo(() => CARDS.slice(getGoneCount()));

    InteractionTracker.trackSwipe(getRef, props.isDisabled, {
        getAxis: () => "horizontal",
        getCommitRatio: props.commitRatio,
        onSwipe: (progressRatio) => {
            setProgress(progressRatio);
            props.onSwipe(progressRatio);
        },
        onSwipeEnd: (direction) => {
            setProgress(NO_PROGRESS);
            props.onSwipeEnd(direction);

            if (!direction) return;

            setFlyingDirection(direction);
            clearTimeout(flightTimeout);

            flightTimeout = setTimeout(() => {
                const goneCount = getGoneCount() + 1;

                setGoneCount(goneCount);
                setFlyingDirection(undefined);

                if (goneCount < CARDS.length) return;

                clearTimeout(redealTimeout);

                redealTimeout = setTimeout(() => setGoneCount(0), REDEAL_MS);
            }, FLIGHT_MS);
        },
    });

    const getTopTransform = () => {
        const direction = getFlyingDirection();

        if (!direction) {
            return `translateX(${getProgress() * PERCENT}%) rotate(${getProgress() * MAX_TILT_DEGREES}deg)`;
        }

        const sign = direction === "left" ? LEFTWARD : RIGHTWARD;

        return `translateX(${sign * FLY_RATIO * PERCENT}%) rotate(${sign * FLY_TILT_DEGREES}deg)`;
    };

    const getDepthTransform = (depth: number) =>
        `translateY(${depth * DEPTH_STEP_PX}px) scale(${FULL_SCALE - depth * DEPTH_SHRINK})`;

    const getIsFollowingPointer = (depth: number) => depth === TOP_DEPTH && !getFlyingDirection();

    return (
        <div ref={setRef} class={styles.stackArea}>
            <For each={getRemaining()}>
                {(card, getDepth) => (
                    <div
                        class={styles.stackCard}
                        style={{
                            "z-index": getRemaining().length - getDepth(),
                            "transform": getDepth() === TOP_DEPTH ? getTopTransform() : getDepthTransform(getDepth()),
                            "opacity": getDepth() === TOP_DEPTH && getFlyingDirection() ? 0 : 1,
                            "transition-duration": getIsFollowingPointer(getDepth()) ? "0ms" : `${FLIGHT_MS}ms`,
                        }}
                    >
                        {card}
                    </div>
                )}
            </For>
        </div>
    );
};
