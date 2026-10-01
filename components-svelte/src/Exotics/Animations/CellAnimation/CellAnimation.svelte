<script lang="ts">
    import { untrack } from "svelte";

    import {
        CELL_ANIMATION_DEFAULTS,
        CellAnimationUtils,
        CellAnimationStyles as styles,
    } from "@thewaver/ss-components";
    import type { Index2d } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { CellAnimationProps } from "./CellAnimation.types.js";

    const NO_PROGRESS = 0;
    const FIRST_ITERATION = 0;
    const NO_WEIGHTS: number[][] = [];

    let { playback = $bindable(true), progress = $bindable(NO_PROGRESS), ...props }: CellAnimationProps = $props();

    const durationMs = $derived(props.animationDurationMs ?? CELL_ANIMATION_DEFAULTS.animationDurationMs);
    const iterationCount = $derived(props.animationIterationCount ?? CELL_ANIMATION_DEFAULTS.animationIterationCount);
    const iterationDelayMs = $derived(
        props.animationIterationDelayMs ?? CELL_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const sizeAnchor = $derived(props.sizeAnchor ?? CELL_ANIMATION_DEFAULTS.sizeAnchor);
    const finalFrame = $derived(props.finalFrame ?? CELL_ANIMATION_DEFAULTS.finalFrame);

    let root = $state<HTMLDivElement>();
    let img = $state<HTMLImageElement>();
    let container = $state<HTMLDivElement>();
    let currentIteration = $state(FIRST_ITERATION);

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => img ?? undefined);

    let lastCellCount: Index2d | undefined;

    const cellCount = $derived.by(() => {
        const next = CellAnimationUtils.computeCellCount(props.cellCount, getRootSize());

        if (lastCellCount && CellAnimationUtils.getIsSameCount(lastCellCount, next)) return lastCellCount;

        lastCellCount = next;

        return next;
    });

    const weights = $derived(props.computeCellWeights?.(cellCount) ?? NO_WEIGHTS);
    const columnEdges = $derived(CellAnimationUtils.computeEdges(getRootSize().width, cellCount.col));
    const rowEdges = $derived(CellAnimationUtils.computeEdges(getRootSize().height, cellCount.row));
    const cellDefs = $derived(CellAnimationUtils.computeCellDefs(cellCount, weights));
    const evaluationDefs = $derived(CellAnimationUtils.computeEvaluationDefs(cellDefs, columnEdges, rowEdges));

    const frameState = $derived(CellAnimationUtils.computeFrameState(currentIteration, iterationCount, finalFrame));

    const isRunning = $derived(playback && !getIsPageHidden() && !frameState.hasEnded);

    watchChange(
        () => props.src,
        () => {
            currentIteration = FIRST_ITERATION;
            progress = NO_PROGRESS;
        },
    );

    $effect(() => {
        const rootRef = root;
        const containerRef = container;
        const defs = evaluationDefs;
        const value = progress;
        const areCellsMounted = frameState.areCellsMounted;

        if (!rootRef) return;

        untrack(() => {
            const cells =
                containerRef && areCellsMounted
                    ? (Array.from(containerRef.querySelectorAll(":scope > div")) as HTMLElement[])
                    : [];

            CellAnimationUtils.drawFrame(
                rootRef,
                cells,
                defs,
                value,
                props.computeRootAnimation,
                props.computeCellAnimation,
            );
        });
    });

    $effect(() => {
        if (!isRunning) return;

        return untrack(() =>
            CellAnimationUtils.runPasses({
                getProgress: () => progress,
                setProgress: (value) => {
                    progress = value;
                },
                getCurrentIteration: () => currentIteration,
                setCurrentIteration: (value) => {
                    currentIteration = value;
                },
                getDurationMs: () => durationMs,
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

    <div bind:this={container} class={styles.cellAnimationContainer} style={containerStyle}>
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
</div>
