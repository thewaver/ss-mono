<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ProgressContentProps } from "./ProgressContent.types";

    const PERCENT = 100;

    let props: ProgressContentProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.progressRow, layerClass]}>
    <div
        class={[
            styles.progressTrack,
            props.state.ratio === undefined && styles.isIndeterminate,
            props.state.hasError && styles.hasError,
        ]}
    >
        <div class={styles.progressFill} style:width={`${(props.state.ratio ?? 0) * PERCENT}%`}></div>
    </div>

    <div class={styles.progressReadout} aria-hidden="true">
        {props.state.ratio === undefined
            ? "working…"
            : `${Math.round(props.state.ratio * PERCENT)}% of ${props.state.max}`}
    </div>
</div>
