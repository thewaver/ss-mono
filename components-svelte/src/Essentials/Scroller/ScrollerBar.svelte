<script lang="ts">
    import { onDestroy, untrack } from "svelte";

    import {
        type ScrollerAxis,
        type ScrollerBarRefs,
        type ScrollerBarRenderProps,
        ScrollerUtils,
        ScrollerStyles as styles,
    } from "@thewaver/ss-components";
    import { FunctionUtils } from "@thewaver/ss-utils";

    import type { ScrollerBarProps } from "./Scroller.types.js";

    const ARIA_VALUE_MAX = 100;
    const ARIA_VALUE_THROTTLE_MS = 100;

    const ARIA_ORIENTATIONS: Record<ScrollerAxis, "horizontal" | "vertical"> = { x: "horizontal", y: "vertical" };

    let props: ScrollerBarProps = $props();

    let track = $state.raw<HTMLElement>();
    let thumb = $state.raw<HTMLElement>();
    let trackLength = $state(0);
    let isDragging = $state(false);
    let ariaValue = $state(0);

    const bar = ScrollerUtils.createBar({
        axis: untrack(() => props.axis),
        getBox: () => props.boxRef,
        getTrack: () => track,
        getThumb: () => thumb,
        getOverlapCount: () => props.overlapCount,
        getComputeProgressAtPoint: () => props.computeProgressAtPoint,
        onDraggingChange: (next) => {
            isDragging = next;
        },
    });

    const refs: ScrollerBarRefs = {
        setTrackRef: (element) => {
            track = element;
        },
        setThumbRef: (element) => {
            thumb = element;
        },
    };

    $effect(() => {
        const element = track;
        const axis = props.axis;

        if (!element) return;

        return untrack(() =>
            ScrollerUtils.observeTrackLength(element, axis, (length) => {
                trackLength = length;
            }),
        );
    });

    $effect(() => {
        const root = props.rootRef;

        if (!root) return;

        root.addEventListener("click", bar.swallowClick, true);

        return () => root.removeEventListener("click", bar.swallowClick, true);
    });

    const ratio = $derived(ScrollerUtils.computeProgressRatio(props.metrics));

    const thumbLength = $derived(ScrollerUtils.computeThumbLength(props.metrics, trackLength));

    const reportAriaValue = FunctionUtils.trailingThrottle((next: number) => {
        ariaValue = Math.round(next * ARIA_VALUE_MAX);
    }, ARIA_VALUE_THROTTLE_MS);

    $effect(() => {
        const next = ratio;

        untrack(() => reportAriaValue(next));
    });

    onDestroy(() => {
        bar.stop();
        reportAriaValue.cancel();
    });

    const renderProps: ScrollerBarRenderProps = $derived.by(() => {
        const isScrolling = props.isAutoHiding && props.isScrolling;
        const isHovered = props.isAutoHiding && props.isHovered;

        return {
            axis: props.axis,
            ratio,
            thumbLength,
            thumbOffset: ScrollerUtils.computeThumbOffset(ratio, trackLength, thumbLength),
            isDragging,
            isScrolling,
            isHovered,
            isShown: !props.isAutoHiding || isScrolling || isHovered || isDragging,
        };
    });
</script>

<div
    role="scrollbar"
    aria-controls={props.boxId}
    aria-orientation={ARIA_ORIENTATIONS[props.axis]}
    aria-valuemin={0}
    aria-valuemax={ARIA_VALUE_MAX}
    aria-valuenow={ariaValue}
    class={[
        styles.scrollerBar,
        styles.scrollerBarVariants[props.axis],
        props.isOverlaid ? styles.scrollerBarOverlaidVariants[props.axis] : styles.scrollerBarKeptVariants[props.axis],
    ]}
    style:align-self={props.isOverlaid && props.axis === "x" ? props.side : undefined}
    style:justify-self={props.isOverlaid && props.axis === "y" ? props.side : undefined}
    onpointerdown={(e) => bar.press(e)}
>
    {@render props.renderBar(renderProps, refs)}
</div>
