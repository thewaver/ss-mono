<script lang="ts">
    import { untrack } from "svelte";

    import {
        CELL_ANIMATION_DEFAULTS,
        CellAnimationUtils,
        SliceAnimationUtils,
        SliceRendererStyles,
        SliceRendererUtils,
        CellAnimationStyles as styles,
    } from "@thewaver/ss-components";
    import { CellAnimationConst } from "@thewaver/ss-components/internal";
    import { type Index2d, MathUtils, Size2d } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { SliceRendererSvelteUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { CellAnimationProps } from "./CellAnimation.types.js";

    let { playback = $bindable(true), progress = $bindable(CellAnimationConst.NO_PROGRESS), ...props }: CellAnimationProps = $props();

    const durationMs = $derived(props.animationDurationMs ?? CELL_ANIMATION_DEFAULTS.animationDurationMs);
    const iterationCount = $derived(props.animationIterationCount ?? CELL_ANIMATION_DEFAULTS.animationIterationCount);
    const iterationDelayMs = $derived(
        props.animationIterationDelayMs ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const sizeAnchor = $derived(props.sizeAnchor ?? CELL_ANIMATION_DEFAULTS.sizeAnchor);
    const finalFrame = $derived(props.finalFrame ?? CELL_ANIMATION_DEFAULTS.finalFrame);
    const origin = $derived(props.origin ?? CELL_ANIMATION_DEFAULTS.origin);
    const renderer = $derived(props.renderer ?? CELL_ANIMATION_DEFAULTS.renderer);
    const cycleDurationMs = $derived(SliceAnimationUtils.computeCycleDurationMs(durationMs, props.playbackOpts));

    const viewportContext = getViewportContext();

    let root = $state<HTMLDivElement>();
    let img = $state<HTMLImageElement>();
    let container = $state<HTMLDivElement>();
    let canvas = $state<HTMLCanvasElement>();
    let currentIteration = $state(CellAnimationConst.FIRST_ITERATION);
    let shownSize = $state.raw<Size2d>({ width: 0, height: 0 });

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => img ?? undefined);

    let lastCellCount: Index2d | undefined;

    const cellCount = $derived.by(() => {
        const next = CellAnimationUtils.computeCellCount(props.cellCount, getRootSize());

        if (lastCellCount && CellAnimationUtils.getIsSameCount(lastCellCount, next)) return lastCellCount;

        lastCellCount = next;

        return next;
    });

    const weights = $derived(props.computeSliceWeights?.(cellCount) ?? CellAnimationConst.NO_WEIGHTS);
    const columnEdges = $derived(CellAnimationUtils.computeEdges(getRootSize().width, cellCount.col));
    const rowEdges = $derived(CellAnimationUtils.computeEdges(getRootSize().height, cellCount.row));
    const cellDefs = $derived(CellAnimationUtils.computeCellDefs(cellCount, weights));
    const evaluationDefs = $derived(CellAnimationUtils.computeEvaluationDefs(cellDefs, columnEdges, rowEdges));
    const slices = $derived(SliceAnimationUtils.withOrigin(evaluationDefs, origin));

    const frameState = $derived(CellAnimationUtils.computeFrameState(currentIteration, iterationCount, finalFrame));

    const isElementsOnly = $derived(renderer === "elements");

    const getIsAvailable = SliceRendererSvelteUtils.createIsAvailable(() => isElementsOnly);

    const getPicture = SliceRendererSvelteUtils.createPicture(
        () => props.src,
        () => isElementsOnly,
    );

    const tables = $derived(
        isElementsOnly ? undefined : SliceAnimationUtils.resolveTables(props.computeSliceAnimation, slices),
    );

    const isOnGraphicsCard = $derived(
        getIsAvailable() && SliceRendererUtils.getCanDraw(renderer, getPicture()) && !!tables,
    );

    const getItem = SliceRendererSvelteUtils.createItem(() => canvas ?? undefined, getIsAvailable);

    const easing = $derived(SliceRendererUtils.computeEasing(props.breakpointOpts?.easing));

    const rendererSlices = $derived.by(() => {
        const tableIndices = tables?.tableIndices ?? [];

        return cellDefs.map((defs, idx) => {
            const bounds = CellAnimationUtils.computeCellBounds(columnEdges, rowEdges, defs.pos);

            return {
                left: bounds.col,
                top: bounds.row,
                width: bounds.width,
                height: bounds.height,
                weight: defs.weight,
                table: tableIndices[idx] ?? 0,
            };
        });
    });

    const area = $derived.by(() => {
        const size = getRootSize();
        const largest = evaluationDefs.reduce(
            (most, defs) => ({
                width: Math.max(most.width, defs.size.width),
                height: Math.max(most.height, defs.size.height),
            }),
            { width: 0, height: 0 },
        );
        const reach = SliceRendererUtils.computeReach(tables?.tables ?? [], largest, size);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
    });

    const isRunning = $derived(
        playback &&
            !getIsPageHidden() &&
            !frameState.hasEnded &&
            !!root &&
            (isOnGraphicsCard ? !!getItem() : !!container),
    );

    watchChange(
        () => props.src,
        () => {
            currentIteration = CellAnimationConst.FIRST_ITERATION;
            progress = CellAnimationConst.NO_PROGRESS;
        },
    );

    $effect(() => {
        const rootRef = root;
        const containerRef = container;
        const currentSlices = slices;
        const value = progress;
        const areCellsMounted = frameState.areCellsMounted;
        const onGraphicsCard = isOnGraphicsCard;
        const timing = SliceAnimationUtils.computeTiming(value, durationMs, props.breakpointOpts, props.playbackOpts);

        if (!rootRef || onGraphicsCard) return;

        untrack(() => {
            const cells =
                containerRef && areCellsMounted
                    ? (Array.from(containerRef.querySelectorAll(":scope > div")) as HTMLElement[])
                    : [];

            CellAnimationUtils.drawFrame(
                rootRef,
                cells,
                currentSlices,
                value,
                timing,
                props.computeRootAnimation,
                props.computeSliceAnimation,
            );
        });
    });

    $effect(() => {
        const rootRef = root;
        const item = getItem();
        const value = progress;
        const onGraphicsCard = isOnGraphicsCard;
        const timing = SliceAnimationUtils.computeTiming(value, durationMs, props.breakpointOpts, props.playbackOpts);
        const currentTables = tables?.tables ?? [];
        const currentSlices = rendererSlices;
        const currentArea = area;
        const currentEasing = easing;
        const size = getRootSize();
        const isShown = frameState.areCellsMounted;
        const src = props.src;

        getPicture();

        if (!rootRef || !item || !onGraphicsCard) return;

        untrack(() => {
            if (props.computeRootAnimation) {
                SliceAnimationUtils.assignAnimationProps(rootRef, props.computeRootAnimation(MathUtils.clamp01(value)));
            }

            const scale = window.devicePixelRatio * viewportContext.getScale();
            const sliceWindow = SliceAnimationUtils.computeWindow(timing);
            const shown = item.draw({
                mode: "slices",
                src,
                tables: currentTables,
                easing: currentEasing,
                slices: currentSlices,
                size,
                area: currentArea,
                scale,
                timeline: timing.globalTimeline,
                half: sliceWindow.half,
                isDescending: sliceWindow.isDescending,
                isShown,
                hasPerspective: true,
            });
            const next = { width: shown.width / scale, height: shown.height / scale };

            if (!Size2d.isSame(shownSize, next)) shownSize = next;
        });
    });

    $effect(() => {
        if (!isRunning) return;

        return untrack(() =>
            SliceAnimationUtils.runPasses({
                getProgress: () => progress,
                setProgress: (value) => {
                    progress = value;
                },
                getCurrentIteration: () => currentIteration,
                setCurrentIteration: (value) => {
                    currentIteration = value;
                },
                getDurationMs: () => cycleDurationMs,
                getIterationCount: () => iterationCount,
                getIterationDelayMs: () => iterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    const containerStyle = $derived(
        toStyle(
            assignInlineVars({
                [styles.cellSrcVar]: CellAnimationUtils.toSourceImage(props.src),
                [styles.cellSizeVar]: `${getRootSize().width}px ${getRootSize().height}px`,
            }),
            {
                width: `${getRootSize().width}px`,
                height: `${getRootSize().height}px`,
                perspective: CellAnimationUtils.computePerspective(getRootSize()),
            },
        ),
    );
</script>

<div
    bind:this={root}
    class={styles.cellAnimationRoot}
    role={props.ariaLabel ? "img" : undefined}
    aria-label={props.ariaLabel}
    aria-hidden={props.ariaLabel ? undefined : "true"}
>
    <img
        bind:this={img}
        src={props.src}
        class={[styles.cellAnimationAnchor, frameState.isSourceRevealed && styles.cellAnimationAnchorRevealed]}
        width={sizeAnchor === "width" ? "100%" : "auto"}
        height={sizeAnchor === "height" ? "100%" : "auto"}
        aria-hidden="true"
    />

    {#if isOnGraphicsCard}
        <div
            class={styles.cellAnimationContainer}
            style:width={`${getRootSize().width}px`}
            style:height={`${getRootSize().height}px`}
        >
            <canvas
                bind:this={canvas}
                class={SliceRendererStyles.sliceRendererCanvas}
                style:left={`${area.x}px`}
                style:top={`${area.y}px`}
                style:width={`${shownSize.width}px`}
                style:height={`${shownSize.height}px`}
                aria-hidden="true"
            ></canvas>
        </div>
    {:else}
        <div
            bind:this={container}
            class={[styles.cellAnimationContainer, isRunning && styles.cellAnimationContainerMoving]}
            style={containerStyle}
        >
            {#if frameState.areCellsMounted}
                {#each cellDefs as defs, index (index)}
                    {@const bounds = CellAnimationUtils.computeCellBounds(columnEdges, rowEdges, defs.pos)}
                    <div
                        class={styles.cellAnimationCell}
                        style:left={`${bounds.col}px`}
                        style:top={`${bounds.row}px`}
                        style:width={`${bounds.width}px`}
                        style:height={`${bounds.height}px`}
                        style:background-position={`${-bounds.col}px ${-bounds.row}px`}
                        style:z-index={CellAnimationUtils.computeCellDepth(defs.weight)}
                        aria-hidden="true"
                    ></div>
                {/each}
            {/if}
        </div>
    {/if}
</div>
