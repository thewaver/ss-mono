import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import * as styles from "../PointerTrackerPage.css";

const MAX_TILT_DEGREES = 14;
const CENTRE = 0.5;
const FULL = 2;

export const TiltExample = () => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getTilt = createMemo(() => {
        if (getPrefersReducedMotion() || !getIsPointerPresent()) return { x: 0, y: 0 };

        const reading = getReading();

        return {
            x: (MathUtils.clamp01(reading.boxRatio.y) - CENTRE) * FULL * -MAX_TILT_DEGREES,
            y: (MathUtils.clamp01(reading.boxRatio.x) - CENTRE) * FULL * MAX_TILT_DEGREES,
        };
    });

    return (
        <div class={styles.tiltStage}>
            <div
                ref={setRef}
                class={styles.tiltCard}
                style={{ transform: `rotateX(${getTilt().x}deg) rotateY(${getTilt().y}deg)` }}
            >
                Tip me
            </div>
        </div>
    );
};
