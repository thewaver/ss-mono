<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeKnob/RangeKnob.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RangeKnobProps } from "./RangeKnob.types";

    let props: RangeKnobProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const angle = $derived(props.startAngle + (props.renderProps.ratios[0] ?? 0) * props.sweepAngle);
</script>

<div
    class={[
        styles.rangeKnob,
        layerClass,
        props.renderProps.focusVisibleThumb !== undefined && styles.isFocused,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.hasError && styles.hasError,
    ]}
>
    <div class={styles.rangeKnobPointer} style:transform={`rotate(${angle}deg)`}></div>

    <div class={styles.rangeKnobReadout} aria-hidden="true">
        {props.renderProps.values[0]}
    </div>
</div>
