<script lang="ts">
    import { untrack } from "svelte";

    import {
        FocusManagerUtils,
        SCROLLER_AXES,
        SCROLLER_DEFAULTS,
        type ScrollerAxis,
        type ScrollerController,
        type ScrollerStepper,
        ScrollerUtils,
        ScrollerStyles as styles,
    } from "@thewaver/ss-components";

    import type { ScrollerProps } from "./Scroller.types.js";
    import ScrollerBar from "./ScrollerBar.svelte";

    let { progress = $bindable(ScrollerUtils.NO_PROGRESS), ...props }: ScrollerProps = $props();

    const generatedId = $props.id();

    let root = $state<HTMLDivElement>();
    let box = $state<HTMLDivElement>();
    let metrics = $state.raw(ScrollerUtils.NO_BOX_METRICS);
    let isScrolling = $state(false);
    let isHovered = $state(false);
    let hasFocusable = $state(false);

    let reportedProgress = ScrollerUtils.NO_PROGRESS;

    const id = $derived(props.id ?? generatedId);
    const padding = $derived(props.padding ?? SCROLLER_DEFAULTS.padding);
    const overlapCount = $derived(props.overlapCount ?? SCROLLER_DEFAULTS.overlapCount);

    const overflow = $derived({
        x: props.overflowX ?? SCROLLER_DEFAULTS.overflowX,
        y: props.overflowY ?? SCROLLER_DEFAULTS.overflowY,
    });

    const isAutoHiding = $derived(props.isAutoHiding ?? SCROLLER_DEFAULTS.isAutoHiding);
    const isBarOverlaid = $derived(props.isBarOverlaid ?? SCROLLER_DEFAULTS.isBarOverlaid);

    const barSides = $derived({
        x: props.barSideX ?? SCROLLER_DEFAULTS.barSideX,
        y: props.barSideY ?? SCROLLER_DEFAULTS.barSideY,
    });

    const areaTemplate = $derived(ScrollerUtils.computeAreaTemplate(barSides));

    const runAxis = $derived(ScrollerUtils.getRunAxis(overflow.x, overflow.y));

    const scrollingAxes = $derived(SCROLLER_AXES.filter((axis) => overflow[axis] !== "hidden"));

    const createStepper = (axis: ScrollerAxis): ScrollerStepper => ({
        getIsAtStart: () => !ScrollerUtils.getCanStep(overflow[axis], metrics[axis], "previous"),
        getIsAtEnd: () => !ScrollerUtils.getCanStep(overflow[axis], metrics[axis], "next"),
        stepToPrevious: () =>
            overflow[axis] !== "hidden" && ScrollerUtils.stepTo(box, "previous", axis, overlapCount),
        stepToNext: () => overflow[axis] !== "hidden" && ScrollerUtils.stepTo(box, "next", axis, overlapCount),
    });

    const controller: ScrollerController = {
        getBoxId: () => id,
        x: createStepper("x"),
        y: createStepper("y"),
    };

    $effect(() => untrack(() => props.onMount?.(controller)));

    $effect(() => {
        const next = ScrollerUtils.computeProgress(metrics);

        untrack(() => {
            if (ScrollerUtils.getIsSameProgress(next, reportedProgress)) return;

            reportedProgress = next;
            progress = next;
        });
    });

    $effect(() => {
        const current = progress;
        const ref = box;

        if (!ref) return;

        untrack(() =>
            ScrollerUtils.scrollToRatios(ref, {
                x: current.x === reportedProgress.x ? undefined : current.x,
                y: current.y === reportedProgress.y ? undefined : current.y,
            }),
        );
    });

    const getHasBar = (axis: ScrollerAxis) =>
        props.renderBar !== undefined && ScrollerUtils.getHasBar(overflow[axis], metrics[axis]);

    $effect(() => {
        const ref = box;

        if (!ref) return;

        return untrack(() =>
            ScrollerUtils.observe(ref, (next) => {
                if (!ScrollerUtils.getIsSameBoxMetrics(metrics, next)) metrics = next;
            }),
        );
    });

    $effect(() => {
        const ref = box;

        if (!ref) return;

        return untrack(() =>
            FocusManagerUtils.observeHasFocusable(ref, (next) => {
                hasFocusable = next;
            }),
        );
    });

    const isBoxTabStop = $derived(
        !hasFocusable && scrollingAxes.some((axis) => ScrollerUtils.getIsScrollable(metrics[axis])),
    );

    $effect(() => {
        const rootRef = root;
        const boxRef = box;
        const isOn = isAutoHiding;

        if (!rootRef || !boxRef || !isOn) return;

        return untrack(() =>
            ScrollerUtils.observeActivity(rootRef, boxRef, {
                getHideDelayMs: () => props.hideDelayMs ?? SCROLLER_DEFAULTS.hideDelayMs,
                onScrollingChange: (next) => {
                    isScrolling = next;
                },
                onHoveredChange: (next) => {
                    isHovered = next;
                },
            }),
        );
    });

    const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement | null;

        if (!box || !target || target === box) return;

        ScrollerUtils.reveal(box, target, padding, scrollingAxes);
    };
</script>

{#snippet renderBar(axis: ScrollerAxis)}
    {#if props.renderBar && getHasBar(axis)}
        <ScrollerBar
            {axis}
            boxId={id}
            boxRef={box}
            rootRef={root}
            metrics={metrics[axis]}
            isOverlaid={isBarOverlaid}
            side={barSides[axis]}
            {isAutoHiding}
            {isScrolling}
            {isHovered}
            {overlapCount}
            computeProgressAtPoint={props.computeProgressAtPoint}
            renderBar={props.renderBar}
        />
    {/if}
{/snippet}

<div
    bind:this={root}
    class={styles.scrollerRoot}
    style:grid-template-areas={areaTemplate.areas}
    style:grid-template-columns={areaTemplate.columns}
    style:grid-template-rows={areaTemplate.rows}
>
    <div
        {id}
        bind:this={box}
        tabindex={isBoxTabStop ? 0 : undefined}
        class={[
            styles.scrollerBox,
            styles.scrollerBoxVariants[runAxis],
            scrollingAxes.length > 1 && styles.scrollerBoxBothWays,
        ]}
        style:overflow-x={overflow.x}
        style:overflow-y={overflow.y}
        style:padding-block={runAxis === "x" ? `${padding}px` : undefined}
        style:padding-block-start={runAxis === "y" ? `${padding}px` : undefined}
        style:padding-inline={runAxis === "y" ? `${padding}px` : undefined}
        style:padding-inline-start={runAxis === "x" ? `${padding}px` : undefined}
        onfocusin={handleFocusIn}
    >
        {@render props.children?.()}

        <div class={styles.scrollerBoxEnd} style:flex-basis={`${padding}px`}></div>
    </div>

    {@render renderBar("x")}
    {@render renderBar("y")}
</div>
