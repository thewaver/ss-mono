import { createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import * as styles from "../PointerTrackerPage.css";

const MAX_TILT_DEGREES = 14;
const CENTRE = 0.5;
const FULL = 2;
const PERCENT = 100;
const SHEEN_OVERTRAVEL = 1.6;
const SHEEN_ANGLE_DEGREES = 115;
const SHEEN_BAND_SPREAD = 14;
const SHEEN_OPACITY = 0.8;

export const TiltExample = () => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getIsResting = () => getPrefersReducedMotion() || !getIsPointerPresent();

    const getTilt = createMemo(() => {
        if (getIsResting()) return { x: 0, y: 0 };

        const reading = getReading();

        return {
            x: (MathUtils.clamp01(reading.boxRatio.y) - CENTRE) * FULL * -MAX_TILT_DEGREES,
            y: (MathUtils.clamp01(reading.boxRatio.x) - CENTRE) * FULL * MAX_TILT_DEGREES,
        };
    });

    const getSheenPosition = createMemo(() => {
        const reading = getReading();
        const across = MathUtils.clamp01(reading.boxRatio.x) - CENTRE;
        const down = MathUtils.clamp01(reading.boxRatio.y) - CENTRE;

        return MathUtils.clamp01(CENTRE - (across + down) * CENTRE * SHEEN_OVERTRAVEL) * PERCENT;
    });

    return (
        <div class={styles.tiltStage}>
            <div
                ref={setRef}
                class={styles.tiltCard}
                style={{ transform: `rotateX(${getTilt().x}deg) rotateY(${getTilt().y}deg)` }}
            >
                Tip me
                <div
                    class={styles.tiltSheen}
                    style={{
                        "opacity": getIsResting() ? 0 : SHEEN_OPACITY,
                        "background-image": `linear-gradient(${SHEEN_ANGLE_DEGREES}deg, transparent ${getSheenPosition() - SHEEN_BAND_SPREAD}%, rgba(255, 255, 255, 0.5) ${getSheenPosition()}%, transparent ${getSheenPosition() + SHEEN_BAND_SPREAD}%)`,
                    }}
                />
            </div>
        </div>
    );
};
