import type { CSSProperties } from "react";

import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
import {
    DEFAULT_PROGRESS_CONTENT_ORIENTATION,
    PERCENT,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentReact.types";

export const PageProgressContent = (props: ProgressContentProps) => {
    const layerClass = useLayerClass();

    const isVertical = (props.orientation ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical";

    const isIndeterminate = props.state.ratio === undefined;

    const fillLength = isIndeterminate ? undefined : `${props.state.ratio! * PERCENT}%`;

    const valueVars = isIndeterminate
        ? undefined
        : (assignInlineVars({
              [skinVars.startValue]: "0",
              [skinVars.endValue]: `${props.state.ratio}`,
          }) as CSSProperties);

    const fill = (
        <div
            className={[styles.progressFill, isVertical && styles.isVertical].filter(Boolean).join(" ")}
            style={isVertical ? { height: fillLength } : { width: fillLength }}
        />
    );

    return (
        <div
            className={[styles.progressRow, layerClass, isVertical && styles.isVertical].filter(Boolean).join(" ")}
            style={valueVars}
        >
            <div className={[styles.progressBar, props.state.hasError && styles.hasError].filter(Boolean).join(" ")}>
                <div
                    className={[
                        styles.progressTrack,
                        isIndeterminate && styles.isIndeterminate,
                        props.state.hasError && styles.hasError,
                        isVertical && styles.isVertical,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {isIndeterminate && fill}
                </div>

                {!isIndeterminate && fill}

                {!isIndeterminate && (
                    <div
                        className={[styles.progressTipAnchor, isVertical && styles.isVertical]
                            .filter(Boolean)
                            .join(" ")}
                        style={isVertical ? { bottom: fillLength } : { insetInlineStart: fillLength }}
                        aria-hidden="true"
                    >
                        <div
                            className={[
                                styles.progressTip,
                                props.state.hasError && styles.hasError,
                                isVertical && styles.isVertical,
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        />
                    </div>
                )}
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
