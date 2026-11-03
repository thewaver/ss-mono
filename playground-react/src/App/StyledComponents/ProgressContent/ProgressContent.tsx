import {
    DEFAULT_PROGRESS_CONTENT_ORIENTATION,
    PERCENT,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentReact.types";

export const PageProgressContent = (props: ProgressContentProps) => {
    const layerClass = useLayerClass();

    const isVertical = (props.orientation ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical";

    const fillLength = props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%`;

    return (
        <div className={[styles.progressRow, layerClass, isVertical && styles.isVertical].filter(Boolean).join(" ")}>
            <div
                className={[
                    styles.progressTrack,
                    props.state.ratio === undefined && styles.isIndeterminate,
                    props.state.hasError && styles.hasError,
                    isVertical && styles.isVertical,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div
                    className={[styles.progressFill, isVertical && styles.isVertical].filter(Boolean).join(" ")}
                    style={isVertical ? { height: fillLength } : { width: fillLength }}
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
