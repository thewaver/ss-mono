<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { ProgressContentProps } from "./ProgressContentSvelte.types";
    import {
        DEFAULT_PROGRESS_CONTENT_ORIENTATION,
        PERCENT,
    } from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";

    let props: ProgressContentProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const isVertical = $derived((props.orientation ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical");

    const isIndeterminate = $derived(props.state.ratio === undefined);

    const fillLength = $derived(props.state.ratio === undefined ? undefined : `${props.state.ratio * PERCENT}%`);

    const valueVars = $derived(
        isIndeterminate
            ? undefined
            : assignInlineVars({
                  [skinVars.startValue]: "0",
                  [skinVars.endValue]: `${props.state.ratio}`,
              }),
    );
</script>

{#snippet fill()}
    <div
        class={[styles.progressFill, isVertical && styles.isVertical]}
        style:width={isVertical ? undefined : fillLength}
        style:height={isVertical ? fillLength : undefined}
    ></div>
{/snippet}

<div class={[styles.progressRow, layerClass, isVertical && styles.isVertical]} style={toStyle(valueVars)}>
    <div class={[styles.progressBar, props.state.hasError && styles.hasError]}>
        <div
            class={[
                styles.progressTrack,
                isIndeterminate && styles.isIndeterminate,
                props.state.hasError && styles.hasError,
                isVertical && styles.isVertical,
            ]}
        >
            {#if isIndeterminate}
                {@render fill()}
            {/if}
        </div>

        {#if !isIndeterminate}
            {@render fill()}

            <div
                class={[styles.progressTipAnchor, isVertical && styles.isVertical]}
                style:bottom={isVertical ? fillLength : undefined}
                style:inset-inline-start={isVertical ? undefined : fillLength}
                aria-hidden="true"
            >
                <div
                    class={[styles.progressTip, props.state.hasError && styles.hasError, isVertical && styles.isVertical]}
                ></div>
            </div>
        {/if}
    </div>

    <div class={styles.progressReadout} aria-hidden="true">
        <bdi>
            {props.state.ratio === undefined
                ? "working…"
                : `${Math.round(props.state.ratio * PERCENT)}% of ${props.state.max}`}
        </bdi>
    </div>
</div>
