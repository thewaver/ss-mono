import { access } from "@thewaver/ss-components";

import type { ProgressRingProps } from "./ProgressRing.types";

import * as styles from "./ProgressRing.css";

const PERCENT = 100;
const HALF = 0.5;
const INDETERMINATE_ARC = 0.25;
const RADIUS = (styles.RING_SIZE - styles.RING_STROKE) * HALF;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PageProgressRing = (props: ProgressRingProps) => {
    const getRatio = () => access(props.state).ratio;

    const getShownRatio = () => getRatio() ?? INDETERMINATE_ARC;

    return (
        <div
            class={styles.progressRing}
            classList={{
                [styles.isIndeterminate]: getRatio() === undefined,
                [styles.hasError]: access(props.state).hasError,
            }}
        >
            <svg
                class={styles.progressRingSvg}
                width={styles.RING_SIZE}
                height={styles.RING_SIZE}
                viewBox={`0 0 ${styles.RING_SIZE} ${styles.RING_SIZE}`}
                aria-hidden="true"
            >
                <circle
                    class={styles.progressRingTrack}
                    cx={styles.RING_SIZE * HALF}
                    cy={styles.RING_SIZE * HALF}
                    r={RADIUS}
                    stroke-width={styles.RING_STROKE}
                />
                <circle
                    class={styles.progressRingFill}
                    cx={styles.RING_SIZE * HALF}
                    cy={styles.RING_SIZE * HALF}
                    r={RADIUS}
                    stroke-width={styles.RING_STROKE}
                    stroke-dasharray={`${CIRCUMFERENCE}`}
                    stroke-dashoffset={`${CIRCUMFERENCE * (1 - getShownRatio())}`}
                />
            </svg>

            <div class={styles.progressRingReadout} aria-hidden="true">
                {getRatio() === undefined ? "…" : `${Math.round(getRatio()! * PERCENT)}%`}
            </div>
        </div>
    );
};
