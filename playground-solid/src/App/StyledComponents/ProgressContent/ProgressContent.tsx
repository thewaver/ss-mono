import { access } from "@thewaver/ss-components-solid";
import {
    DEFAULT_PROGRESS_CONTENT_ORIENTATION,
    PERCENT,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentSolid.types";

export const PageProgressContent = (props: ProgressContentProps) => {
    const getLayerClass = useLayerClass();

    const getIsVertical = () => (access(props.orientation) ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical";

    const getFillLength = () =>
        access(props.state).ratio === undefined ? undefined : `${access(props.state).ratio! * PERCENT}%`;

    return (
        <div class={styles.progressRow} classList={{ [getLayerClass()]: true, [styles.isVertical]: getIsVertical() }}>
            <div
                class={styles.progressTrack}
                classList={{
                    [styles.isIndeterminate]: access(props.state).ratio === undefined,
                    [styles.hasError]: access(props.state).hasError,
                    [styles.isVertical]: getIsVertical(),
                }}
            >
                <div
                    class={styles.progressFill}
                    classList={{ [styles.isVertical]: getIsVertical() }}
                    style={getIsVertical() ? { height: getFillLength() } : { width: getFillLength() }}
                />
            </div>

            <div class={styles.progressReadout} aria-hidden="true">
                <bdi>
                    {access(props.state).ratio === undefined
                        ? "working…"
                        : `${Math.round(access(props.state).ratio! * PERCENT)}% of ${access(props.state).max}`}
                </bdi>
            </div>
        </div>
    );
};
