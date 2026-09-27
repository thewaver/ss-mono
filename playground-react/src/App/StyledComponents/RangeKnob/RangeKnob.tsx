import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/RangeKnob/RangeKnob.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeKnobProps } from "./RangeKnob.types";

export const PageRangeKnob = (props: RangeKnobProps) => {
    const layerClass = useLayerClass();

    const angle = props.startAngle + (props.renderProps.ratios[0] ?? 0) * props.sweepAngle;

    return (
        <div
            className={[
                styles.rangeKnob,
                layerClass,
                props.renderProps.focusVisibleThumb !== undefined && styles.isFocused,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.rangeKnobPointer} style={{ transform: `rotate(${angle}deg)` }} />

            <div className={styles.rangeKnobReadout} aria-hidden="true">
                {props.renderProps.values[0]}
            </div>
        </div>
    );
};
