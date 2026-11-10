<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RangeContentProps } from "./RangeContentSvelte.types";
    import {
        DEFAULT_RANGE_CONTENT_LENGTH,
    } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.const";

    const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

    const center = (ratio: number) =>
        `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE * 0.5}px)`;

    const HALF_DRAWN_THUMB = `${styles.RANGE_DRAWN_THUMB_WIDTH} * 0.5`;

    let props: RangeContentProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const orientation = $derived(props.renderProps.orientation);

    const isPair = $derived(props.renderProps.ratios.length > 1);

    const length = $derived(props.length ?? DEFAULT_RANGE_CONTENT_LENGTH);

    const fill = $derived(props.renderProps.fill);

    const fillStart = $derived(isPair ? `calc(${center(fill.start)} - ${HALF_DRAWN_THUMB})` : "0px");

    const fillSpan = $derived(`calc(${center(fill.end)} + ${HALF_DRAWN_THUMB} - ${fillStart})`);
</script>

<div
    class={[
        styles.rangeContent,
        styles.rangeContentVariants[orientation],
        layerClass,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    style={toStyle(
        orientation === "vertical" ? { height: `${length}px` } : { width: `${length}px` },
        assignInlineVars({ [skinVars.startValue]: `${fill.start}`, [skinVars.endValue]: `${fill.end}` }),
    )}
>
    <div
        class={[styles.rangeTrack, styles.rangeTrackVariants[orientation], props.renderProps.hasError && styles.hasError]}
    ></div>

    <div
        class={[
            styles.rangeFill,
            styles.rangeFillVariants[orientation],
            props.renderProps.hasError && styles.hasError,
        ]}
        style={toStyle(
            orientation === "vertical"
                ? { bottom: fillStart, height: fillSpan }
                : { insetInlineStart: fillStart, width: fillSpan },
        )}
    ></div>

    {#each props.renderProps.ratios as ratio, index (index)}
        <div
            class={[
                styles.rangeThumb,
                styles.rangeThumbVariants[orientation],
                props.renderProps.focusVisibleThumb === index && styles.isFocused,
                props.renderProps.hasError && styles.hasError,
                isPair && index === 0 && styles.isStart,
                isPair && index === 1 && styles.isEnd,
            ]}
            style={toStyle(orientation === "vertical" ? { bottom: travel(ratio) } : { insetInlineStart: travel(ratio) })}
        ></div>
    {/each}
</div>
