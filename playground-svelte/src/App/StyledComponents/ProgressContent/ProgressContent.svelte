<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ProgressContentProps } from "./ProgressContentSvelte.types";
    import { PERCENT } from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";

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
        <div
            class={styles.progressFill}
            style:width={props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%`}
        ></div>
    </div>

    <div class={styles.progressReadout} aria-hidden="true">
        <bdi>
            {props.state.ratio === undefined
                ? "working…"
                : `${Math.round(props.state.ratio * PERCENT)}% of ${props.state.max}`}
        </bdi>
    </div>
</div>
