<script lang="ts">
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { RangeContentProps } from "./RangeContent.types";

    const DEFAULT_RANGE_CONTENT_LENGTH = styles.RANGE_LENGTH;

    const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px))`;

    const center = (ratio: number) =>
        `calc(${ratio} * (100% - ${styles.RANGE_THUMB_SIZE}px) + ${styles.RANGE_THUMB_SIZE * 0.5}px)`;

    let props: RangeContentProps = $props();

    const layerClass = $derived.by(getLayerClass());

    const orientation = $derived(props.renderProps.orientation);

    const length = $derived(props.length ?? DEFAULT_RANGE_CONTENT_LENGTH);

    const fill = $derived(props.renderProps.fill);

    const fillSpan = $derived(travel(fill.end - fill.start));
</script>

<div
    class={[
        styles.rangeContent,
        styles.rangeContentVariants[orientation],
        layerClass,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    style={toStyle(orientation === "vertical" ? { height: `${length}px` } : { width: `${length}px` })}
>
    <div class={[styles.rangeTrack, styles.rangeTrackVariants[orientation]]}></div>

    <div
        class={[
            styles.rangeFill,
            styles.rangeFillVariants[orientation],
            props.renderProps.hasError && styles.hasError,
        ]}
        style={toStyle(
            orientation === "vertical"
                ? { bottom: center(fill.start), height: fillSpan }
                : { left: center(fill.start), width: fillSpan },
        )}
    ></div>

    {#each props.renderProps.ratios as ratio, index (index)}
        <div
            class={[
                styles.rangeThumb,
                styles.rangeThumbVariants[orientation],
                props.renderProps.focusVisibleThumb === index && styles.isFocused,
                props.renderProps.hasError && styles.hasError,
            ]}
            style={toStyle(orientation === "vertical" ? { bottom: travel(ratio) } : { left: travel(ratio) })}
        ></div>
    {/each}
</div>
