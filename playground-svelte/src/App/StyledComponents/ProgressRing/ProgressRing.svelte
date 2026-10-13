<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ProgressRingProps } from "./ProgressRingSvelte.types";
    import {
        CIRCUMFERENCE,
        HALF,
        INDETERMINATE_ARC,
        PERCENT,
        RADIUS,
    } from "@thewaver/ss-playground/App/StyledComponents/ProgressRing/ProgressRing.const";

    let props: ProgressRingProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const ratio = $derived(props.state.ratio);

    const shownRatio = $derived(ratio ?? INDETERMINATE_ARC);
</script>

<div
    class={[
        styles.progressRing,
        layerClass,
        ratio === undefined && styles.isIndeterminate,
        props.state.hasError && styles.hasError,
    ]}
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
            stroke-dashoffset={`${CIRCUMFERENCE * (1 - shownRatio)}`}
        />
    </svg>

    <div class={styles.progressRingReadout} aria-hidden="true">
        {ratio === undefined ? "…" : `${Math.round(ratio * PERCENT)}%`}
    </div>
</div>
