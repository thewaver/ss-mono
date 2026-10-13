import { access } from "@thewaver/ss-components-solid";
import {
    CIRCUMFERENCE,
    HALF,
    INDETERMINATE_ARC,
    PERCENT,
    RADIUS,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressRingProps } from "./ProgressRingSolid.types";

export const PageProgressRing = (props: ProgressRingProps) => {
    const getLayerClass = useLayerClass();

    const getRatio = () => access(props.state).ratio;

    const getShownRatio = () => getRatio() ?? INDETERMINATE_ARC;

    return (
        <div
            class={styles.progressRing}
            classList={{
                [getLayerClass()]: true,
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
