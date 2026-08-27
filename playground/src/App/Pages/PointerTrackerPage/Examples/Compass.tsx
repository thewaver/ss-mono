import { Show, createEffect, createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";

import type { PointerTrackerReadingExampleProps } from "../PointerTrackerPage.types";

import * as styles from "../PointerTrackerPage.css";

const ANGLE_DIGITS = 0;

type Props = PointerTrackerReadingExampleProps;

export const CompassExample = (props: Props) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getBearing = createMemo(() => (getIsPointerPresent() ? getReading().angle : 0));

    createEffect(() => {
        props.onReadingChange(getReading());
    });

    return (
        <div class={styles.compassStage}>
            <div ref={setRef} class={styles.compassDial}>
                <Show
                    when={!getPrefersReducedMotion()}
                    fallback={<span class={styles.compassAngle}>{`${getBearing().toFixed(ANGLE_DIGITS)}°`}</span>}
                >
                    <div class={styles.compassNeedle} style={{ transform: `rotate(${getBearing()}deg)` }} />
                </Show>
            </div>
        </div>
    );
};
