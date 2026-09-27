import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContent.types";

const PERCENT = 100;

export const PageProgressContent = (props: ProgressContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.progressRow, layerClass].join(" ")}>
            <div
                className={[
                    styles.progressTrack,
                    props.state.ratio === undefined && styles.isIndeterminate,
                    props.state.hasError && styles.hasError,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div className={styles.progressFill} style={{ width: `${(props.state.ratio ?? 0) * PERCENT}%` }} />
            </div>

            <div className={styles.progressReadout} aria-hidden="true">
                {props.state.ratio === undefined
                    ? "working…"
                    : `${Math.round(props.state.ratio * PERCENT)}% of ${props.state.max}`}
            </div>
        </div>
    );
};
