<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ProgressContentProps } from "./ProgressContentSvelte.types";
    import {
        DEFAULT_PROGRESS_CONTENT_ORIENTATION,
        PERCENT,
    } from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";

    let props: ProgressContentProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const isVertical = $derived((props.orientation ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical");

    const fillLength = $derived(props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%`);
</script>

<div class={[styles.progressRow, layerClass, isVertical && styles.isVertical]}>
    <div
        class={[
            styles.progressTrack,
            props.state.ratio === undefined && styles.isIndeterminate,
            props.state.hasError && styles.hasError,
            isVertical && styles.isVertical,
        ]}
    >
        <div
            class={[styles.progressFill, isVertical && styles.isVertical]}
            style:width={isVertical ? undefined : fillLength}
            style:height={isVertical ? fillLength : undefined}
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
