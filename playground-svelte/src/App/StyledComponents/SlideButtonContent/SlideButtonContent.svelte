<script lang="ts">
    import type { Snippet } from "svelte";

    import { toStyle } from "@thewaver/ss-components-svelte";
    import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { SlideButtonContentProps } from "./SlideButtonContentSvelte.types";
    import {
        DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH,
    } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.const";

    const travel = (ratio: number) => `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px))`;

    const covered = (ratio: number) =>
        `calc(${ratio} * (100% - ${styles.SLIDE_BUTTON_THUMB_SIZE}px) + ${styles.SLIDE_BUTTON_THUMB_SIZE}px)`;

    let props: SlideButtonContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());

    const length = $derived(props.length ?? DEFAULT_SLIDE_BUTTON_CONTENT_LENGTH);

    const isVertical = $derived(props.renderProps.orientation === "vertical");

    const isRightToLeft = $derived(!isVertical && props.renderProps.direction === "rtl");

    const ratio = $derived(props.renderProps.isPressed ? 1 : props.renderProps.progressRatio);

    const isTracking = $derived(props.renderProps.isDragging || props.renderProps.isHolding);
</script>

<div
    class={[
        styles.slideButtonContent,
        layerClass,
        isVertical && styles.isVertical,
        isRightToLeft && styles.isRightToLeft,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    style={toStyle(
        isVertical ? { height: `${length}px` } : { width: `${length}px` },
        assignInlineVars({ [skinVars.startValue]: "0", [skinVars.endValue]: `${ratio}` }),
    )}
>
    <div
        class={[styles.slideButtonTrack, isVertical && styles.isVertical, props.renderProps.hasError && styles.hasError]}
    >
        <div class={styles.slideButtonHint}>
            {@render props.children?.()}
        </div>
    </div>

    <div
        class={[
            styles.slideButtonFill,
            isTracking && styles.isTracking,
            props.renderProps.hasError && styles.hasError,
        ]}
        style:width={isVertical ? undefined : covered(ratio)}
        style:height={isVertical ? covered(ratio) : undefined}
    ></div>

    <div
        class={[
            styles.slideButtonThumb,
            isTracking && styles.isTracking,
            props.renderProps.isFocusVisible && styles.isFocused,
            props.renderProps.hasError && styles.hasError,
        ]}
        style:left={isVertical || isRightToLeft ? undefined : travel(ratio)}
        style:right={isRightToLeft ? travel(ratio) : undefined}
        style:bottom={isVertical ? travel(ratio) : undefined}
    >
        <svg class={styles.slideButtonArrow} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12 H19 M13 6 L19 12 L13 18" />
        </svg>
    </div>
</div>
