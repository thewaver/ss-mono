import { createSignal } from "solid-js";

import { InteractionTracker } from "@thewaver/ss-components";

import type { InteractionSwipeExampleProps } from "../InteractionTrackerPage.types";

import * as styles from "../InteractionTrackerPage.css";

const PERCENT = 100;
const NO_PROGRESS = 0;

type Props = InteractionSwipeExampleProps;

export const SwipeExample = (props: Props) => {
    const [getRef, setRef] = createSignal<HTMLElement>();
    const [getProgress, setProgress] = createSignal(NO_PROGRESS);
    const [getPresses, setPresses] = createSignal(0);

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
        },
    });

    return (
        <div ref={setRef} class={styles.swipeTrack}>
            <div class={styles.swipeCard} style={{ transform: `translateX(${getProgress() * PERCENT}%)` }}>
                <span>Push me sideways past the commit ratio</span>

                <button
                    type="button"
                    class={styles.swipeButton}
                    onClick={() => {
                        setPresses((prev) => prev + 1);
                    }}
                >
                    {`pressed ${getPresses()} times — a swipe from here does not count`}
                </button>
            </div>
        </div>
    );
};
