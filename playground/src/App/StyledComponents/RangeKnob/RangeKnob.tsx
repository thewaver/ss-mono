import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeKnobProps } from "./RangeKnob.types";

import * as styles from "./RangeKnob.css";

export const PageRangeKnob = (props: RangeKnobProps) => {
    const getLayerClass = useLayerClass();

    const getAngle = () =>
        access(props.startAngle) + (access(props.renderProps).ratios[0] ?? 0) * access(props.sweepAngle);

    return (
        <div
            class={styles.rangeKnob}
            classList={{
                [getLayerClass()]: true,
                [styles.isFocused]: access(props.renderProps).focusVisibleThumb !== undefined,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.hasError]: access(props.renderProps).hasError,
            }}
        >
            <div class={styles.rangeKnobPointer} style={{ transform: `rotate(${getAngle()}deg)` }} />

            <div class={styles.rangeKnobReadout} aria-hidden="true">
                {access(props.renderProps).values[0]}
            </div>
        </div>
    );
};
