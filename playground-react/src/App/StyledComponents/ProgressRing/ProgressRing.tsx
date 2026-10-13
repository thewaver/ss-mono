import {
    CIRCUMFERENCE,
    HALF,
    INDETERMINATE_ARC,
    PERCENT,
    RADIUS,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressRingProps } from "./ProgressRingReact.types";

export const PageProgressRing = (props: ProgressRingProps) => {
    const layerClass = useLayerClass();

    const ratio = props.state.ratio;

    const shownRatio = ratio ?? INDETERMINATE_ARC;

    return (
        <div
            className={[
                styles.progressRing,
                layerClass,
                ratio === undefined && styles.isIndeterminate,
                props.state.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <svg
                className={styles.progressRingSvg}
                width={styles.RING_SIZE}
                height={styles.RING_SIZE}
                viewBox={`0 0 ${styles.RING_SIZE} ${styles.RING_SIZE}`}
                aria-hidden="true"
            >
                <circle
                    className={styles.progressRingTrack}
                    cx={styles.RING_SIZE * HALF}
                    cy={styles.RING_SIZE * HALF}
                    r={RADIUS}
                    strokeWidth={styles.RING_STROKE}
                />
                <circle
                    className={styles.progressRingFill}
                    cx={styles.RING_SIZE * HALF}
                    cy={styles.RING_SIZE * HALF}
                    r={RADIUS}
                    strokeWidth={styles.RING_STROKE}
                    strokeDasharray={`${CIRCUMFERENCE}`}
                    strokeDashoffset={`${CIRCUMFERENCE * (1 - shownRatio)}`}
                />
            </svg>

            <div className={styles.progressRingReadout} aria-hidden="true">
                {ratio === undefined ? "…" : `${Math.round(ratio * PERCENT)}%`}
            </div>
        </div>
    );
};
