<script lang="ts">
    import { untrack } from "svelte";

    import {
        CellAnimationUtils,
        SliceAnimationUtils,
        RGB_ANIMATION_CHANNELS,
        RGB_ANIMATION_DEFAULTS,
        RGBAnimationUtils,
        SVGFilterDefs,
        type SVGColorMixing,
        SliceRendererStyles,
        SliceRendererUtils,
        RGBAnimationStyles as styles,
    } from "@thewaver/ss-components";
    import { RGBAnimationConst } from "@thewaver/ss-components/internal";
    import { MathUtils, Rect } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { SliceRendererSvelteUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { RGBAnimationProps } from "./RGBAnimation.types.js";

    let { playback = $bindable(true), progress = $bindable(RGBAnimationConst.NO_PROGRESS), ...props }: RGBAnimationProps = $props();

    const WHOLE_PASS = { half: 0.5, isDescending: false };
    const LINEAR = SliceRendererUtils.computeEasing(undefined);
    const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

    const filterId = $props.id();

    const viewportContext = getViewportContext();

    const durationMs = $derived(props.animationDurationMs ?? RGB_ANIMATION_DEFAULTS.animationDurationMs);
    const iterationCount = $derived(props.animationIterationCount ?? RGB_ANIMATION_DEFAULTS.animationIterationCount);
    const iterationDelayMs = $derived(
        props.animationIterationDelayMs ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const sizeAnchor = $derived(props.sizeAnchor ?? RGB_ANIMATION_DEFAULTS.sizeAnchor);
    const renderer = $derived(props.renderer ?? RGB_ANIMATION_DEFAULTS.renderer);

    let root = $state<HTMLDivElement>();
    let img = $state<HTMLImageElement>();
    let canvas = $state<HTMLCanvasElement>();
    let channels = $state<HTMLElement[]>([]);
    let shownRect = $state.raw<Rect>(NO_RECT);
    let currentIteration = $state(RGBAnimationConst.FIRST_ITERATION);
    let schemeMixing = $state<SVGColorMixing>(RGBAnimationUtils.readColorMixing(undefined));

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => img ?? undefined);

    const colorMixing = $derived(props.colorMixing ?? schemeMixing);
    const blendMode = $derived(RGBAnimationUtils.getBlendMode(colorMixing));
    const evaluationDefs = $derived(RGBAnimationUtils.computeEvaluationDefs(getRootSize()));

    const isElementsOnly = $derived(renderer === "elements");

    const getIsAvailable = SliceRendererSvelteUtils.createIsAvailable(() => isElementsOnly);

    const getPicture = SliceRendererSvelteUtils.createPicture(
        () => props.src,
        () => isElementsOnly,
    );

    const tables = $derived(
        isElementsOnly
            ? undefined
            : SliceAnimationUtils.resolveTables(
                  props.computeSliceAnimation,
                  evaluationDefs.map(RGBAnimationUtils.toSliceDefs),
              ),
    );

    const isOnGraphicsCard = $derived(
        getIsAvailable() && SliceRendererUtils.getCanDraw(renderer, getPicture()) && !!tables,
    );

    const getItem = SliceRendererSvelteUtils.createItem(() => canvas ?? undefined, getIsAvailable);

    const rendererSlices = $derived.by(() => {
        const size = getRootSize();

        return (tables?.tableIndices ?? []).map((table) => ({
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
            weight: 0,
            table,
        }));
    });

    const area = $derived.by(() => {
        const size = getRootSize();
        const reach = SliceRendererUtils.computeReach(tables?.tables ?? [], size, size);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
    });

    const isRunning = $derived(
        playback &&
            !getIsPageHidden() &&
            currentIteration < iterationCount &&
            !!root &&
            (!isOnGraphicsCard || !!getItem()),
    );

    watchChange(
        () => props.src,
        () => {
            currentIteration = RGBAnimationConst.FIRST_ITERATION;
            progress = RGBAnimationConst.NO_PROGRESS;
        },
    );

    $effect(() => {
        const rootRef = root;

        currentIteration;

        schemeMixing = untrack(() => RGBAnimationUtils.readColorMixing(rootRef));
    });

    $effect(() => {
        const rootRef = root;
        const channelRefs = channels;
        const defs = evaluationDefs;
        const value = progress;
        const onGraphicsCard = isOnGraphicsCard;

        if (!rootRef || onGraphicsCard) return;

        untrack(() =>
            RGBAnimationUtils.drawFrame(
                rootRef,
                channelRefs,
                defs,
                value,
                props.computeRootAnimation,
                props.computeSliceAnimation,
            ),
        );
    });

    $effect(() => {
        const rootRef = root;
        const item = getItem();
        const value = progress;
        const onGraphicsCard = isOnGraphicsCard;
        const currentTables = tables?.tables ?? [];
        const currentSlices = rendererSlices;
        const currentArea = area;
        const size = getRootSize();
        const channelMixing = colorMixing;
        const src = props.src;

        getPicture();

        if (!rootRef || !item || !onGraphicsCard) return;

        untrack(() => {
            const timeline = MathUtils.clamp01(value);

            if (props.computeRootAnimation) {
                SliceAnimationUtils.assignAnimationProps(rootRef, props.computeRootAnimation(timeline));
            }

            const scale = window.devicePixelRatio * viewportContext.getScale();
            item.draw({
                mode: "slices",
                src,
                tables: currentTables,
                easing: LINEAR,
                slices: currentSlices,
                size,
                area: currentArea,
                scale,
                timeline,
                half: WHOLE_PASS.half,
                isDescending: WHOLE_PASS.isDescending,
                isShown: true,
                hasPerspective: true,
                channelMixing,
            }, (next) => {
                if (!Rect.isSame(shownRect, next)) shownRect = next;
            });
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
                [styles.channelSrcVar]: CellAnimationUtils.toSourceImage(props.src),
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
    class={styles.rgbAnimationRoot}
    role={props.ariaLabel ? "img" : undefined}
    aria-label={props.ariaLabel}
    aria-hidden={props.ariaLabel ? undefined : "true"}
>
    <img
        bind:this={img}
        src={props.src}
        class={styles.rgbAnimationAnchor}
        width={sizeAnchor === "width" ? "100%" : "auto"}
        height={sizeAnchor === "height" ? "100%" : "auto"}
        aria-hidden="true"
    />

    <svg class={styles.rgbAnimationFilterHost} aria-hidden="true">
        <defs>
            {#each RGB_ANIMATION_CHANNELS as channel (channel)}
                <filter id={`${filterId}-${channel}`}>
                    <feColorMatrix
                        type="matrix"
                        values={RGBAnimationUtils.computeChannelMatrix(channel, colorMixing)}
                        color-interpolation-filters={SVGFilterDefs.COLOR_SPACE}
                    />
                </filter>
            {/each}
        </defs>
    </svg>

    {#if isOnGraphicsCard}
        <div
            class={styles.rgbAnimationContainer}
            style:width={`${getRootSize().width}px`}
            style:height={`${getRootSize().height}px`}
        >
            <canvas
                bind:this={canvas}
                class={SliceRendererStyles.sliceRendererCanvas}
                style:left={`${shownRect.x}px`}
                style:top={`${shownRect.y}px`}
                style:width={`${shownRect.width}px`}
                style:height={`${shownRect.height}px`}
                aria-hidden="true"
            ></canvas>
        </div>
    {:else}
        <div class={styles.rgbAnimationContainer} style={containerStyle}>
            {#each RGB_ANIMATION_CHANNELS as channel, index (channel)}
                <div
                    bind:this={channels[index]}
                    class={styles.rgbAnimationChannel}
                    style:mix-blend-mode={blendMode}
                    aria-hidden="true"
                >
                    <div class={styles.rgbAnimationChannelPicture} style:filter={`url(#${filterId}-${channel})`}></div>
                </div>
            {/each}
        </div>
    {/if}
</div>
