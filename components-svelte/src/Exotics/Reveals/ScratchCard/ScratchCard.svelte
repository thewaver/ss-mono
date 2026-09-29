<script lang="ts">
    import { untrack } from "svelte";

    import {
        NavigatorUtils,
        SCRATCH_CARD_DEFAULTS,
        type ScratchCardController,
        ScratchCardUtils,
        ScratchCardStyles as styles,
    } from "@thewaver/ss-components";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { ScratchCardProps } from "./ScratchCard.types.js";

    const NOTHING_RUBBED = 0;
    const NO_PATH = "";

    let props: ScratchCardProps = $props();

    const maskId = $props.id();

    let root = $state<HTMLDivElement>();
    let cover = $state<HTMLDivElement>();
    let pathElement = $state<SVGPathElement>();

    let path = $state(NO_PATH);
    let clearedRatio = $state(NOTHING_RUBBED);
    let isClearing = $state(false);
    let isCleared = $state(false);

    const isDisabled = $derived(props.isDisabled === true);

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => cover ?? undefined,
        () => isDisabled,
    );

    const brushRadius = $derived(props.brushRadius ?? SCRATCH_CARD_DEFAULTS.brushRadius);
    const softness = $derived(props.softness ?? SCRATCH_CARD_DEFAULTS.softness);
    const precision = $derived(props.precision ?? SCRATCH_CARD_DEFAULTS.precision);
    const clearThreshold = $derived(props.clearThreshold ?? SCRATCH_CARD_DEFAULTS.clearThreshold);
    const clearDurationMs = $derived(props.clearDurationMs ?? SCRATCH_CARD_DEFAULTS.clearDurationMs);

    const brushShape = $derived({
        radius: brushRadius,
        computePoints: props.computePoints,
        joinRadii: props.joinRadii,
        lameExponents: props.lameExponents,
    });

    const scheduler = ScratchCardUtils.createMeasureScheduler(() => {
        clearedRatio = ScratchCardUtils.measureClearedRatio(pathElement ?? undefined, path, getSize(), precision);
    });

    const startClearing = () => {
        isClearing = true;
    };

    const controller: ScratchCardController = {
        reset: () => {
            scheduler.reset();
            isClearing = false;
            isCleared = false;
            path = NO_PATH;
            clearedRatio = NOTHING_RUBBED;

            return true;
        },
        clear: () => {
            if (isClearing) return false;

            startClearing();

            return true;
        },
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });

    $effect(() => scheduler.cancel);

    $effect(() => {
        if (path !== NO_PATH) untrack(() => scheduler.schedule());
    });

    watchChange(
        () => clearedRatio,
        (ratio) => {
            props.onScratch?.(ratio);

            if (ratio < clearThreshold || isCleared) return;

            startClearing();
        },
    );

    $effect(() => {
        if (!isClearing) return;

        const timeout = setTimeout(() => {
            ScratchCardUtils.keepFocus(cover ?? undefined, root ?? undefined);

            isCleared = true;
            props.onClear?.();
        }, clearDurationMs);

        return () => clearTimeout(timeout);
    });

    const { getIsDragging } = InteractionTrackerSvelteUtils.trackDrag(
        () => cover ?? undefined,
        () => isDisabled,
        {
            onDrag: (ratio) => {
                const point = ScratchCardUtils.toPoint(ratio, getSize());

                if (ScratchCardUtils.getIsRubbedAt(pathElement ?? undefined, path, point, brushRadius)) return;

                path =
                    path +
                    ScratchCardUtils.computeStampPath(
                        point,
                        brushRadius,
                        ScratchCardUtils.computeBrushPoints(brushShape),
                    );
            },
        },
    );

    const pointer = PointerTrackerSvelteUtils.create(
        () => cover ?? undefined,
        () => isDisabled,
    );

    const brushGeometry = $derived(
        ScratchCardUtils.computeBrushGeometry({
            hasRenderer: props.renderBrush !== undefined,
            isClearing,
            isPointerPresent: pointer.getIsPointerPresent(),
            reading: pointer.getReading(),
            size: getSize(),
            shape: brushShape,
        }),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (isDisabled || !NavigatorUtils.getIsActivationKey(e.key)) return;

        e.preventDefault();
        startClearing();
    };
</script>

<div bind:this={root} class={styles.scratchCardRoot} tabindex="-1">
    {@render props.renderContent()}

    <svg class={styles.scratchCardDefs} aria-hidden="true">
        <defs>
            <filter id={`${maskId}-soften`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={ScratchCardUtils.computeBlurDeviation(brushRadius, softness)} />
            </filter>

            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={getSize().width} height={getSize().height}>
                <rect width={getSize().width} height={getSize().height} fill="white" />

                <path
                    bind:this={pathElement}
                    d={path}
                    fill="black"
                    fill-rule="nonzero"
                    filter={`url(#${maskId}-soften)`}
                />
            </mask>
        </defs>
    </svg>

    {#if !isCleared}
        <div
            bind:this={cover}
            class={[styles.scratchCardCover, isClearing && styles.scratchCardCoverClearing]}
            style={toStyle(assignInlineVars({ [styles.clearDurationVar]: `${clearDurationMs}ms` }))}
            role="button"
            tabindex={isDisabled ? undefined : 0}
            aria-label={props.ariaLabel}
            aria-disabled={isDisabled || undefined}
            onkeydown={handleKeyDown}
        >
            {@render props.renderCover(toStyle(ScratchCardUtils.computeMaskStyle(maskId)))}

            {#if brushGeometry}
                <div
                    class={styles.scratchCardBrush}
                    style:left={`${brushGeometry.box.x}px`}
                    style:top={`${brushGeometry.box.y}px`}
                    style:width={`${brushGeometry.box.width}px`}
                    style:height={`${brushGeometry.box.height}px`}
                    aria-hidden="true"
                >
                    {@render props.renderBrush?.(getIsDragging(), brushGeometry)}
                </div>
            {/if}
        </div>
    {/if}
</div>
