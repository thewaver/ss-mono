import { PERCENT } from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentReact.types";

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
                <div
                    className={styles.progressFill}
                    style={{ width: props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%` }}
                />
            </div>

            <div className={styles.progressReadout} aria-hidden="true">
                <bdi>
                    {props.state.ratio === undefined
                        ? "working…"
                        : `${Math.round(props.state.ratio * PERCENT)}% of ${props.state.max}`}
                </bdi>
            </div>
        </div>
    );
};
