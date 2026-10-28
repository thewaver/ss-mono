<script lang="ts">
    import { untrack } from "svelte";

    import {
        CellAnimationUtils,
        RGB_ANIMATION_CHANNELS,
        RGB_ANIMATION_DEFAULTS,
        RGBAnimationUtils,
        SVGFilterDefs,
        type SVGColorMixing,
        RGBAnimationStyles as styles,
    } from "@thewaver/ss-components";
    import { RGBAnimationConst } from "@thewaver/ss-components/internal";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { RGBAnimationProps } from "./RGBAnimation.types.js";

    let { playback = $bindable(true), progress = $bindable(RGBAnimationConst.NO_PROGRESS), ...props }: RGBAnimationProps = $props();

    const filterId = $props.id();

    const durationMs = $derived(props.animationDurationMs ?? RGB_ANIMATION_DEFAULTS.animationDurationMs);
    const iterationCount = $derived(props.animationIterationCount ?? RGB_ANIMATION_DEFAULTS.animationIterationCount);
    const iterationDelayMs = $derived(
        props.animationIterationDelayMs ?? RGB_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const sizeAnchor = $derived(props.sizeAnchor ?? RGB_ANIMATION_DEFAULTS.sizeAnchor);

    let root = $state<HTMLDivElement>();
    let img = $state<HTMLImageElement>();
    let channels = $state<HTMLElement[]>([]);
    let currentIteration = $state(RGBAnimationConst.FIRST_ITERATION);
    let schemeMixing = $state<SVGColorMixing>(RGBAnimationUtils.readColorMixing(undefined));

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => img ?? undefined);

    const colorMixing = $derived(props.colorMixing ?? schemeMixing);
    const blendMode = $derived(RGBAnimationUtils.getBlendMode(colorMixing));
    const evaluationDefs = $derived(RGBAnimationUtils.computeEvaluationDefs(getRootSize()));

    const isRunning = $derived(playback && !getIsPageHidden() && currentIteration < iterationCount);

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

        if (!rootRef) return;

        untrack(() =>
            RGBAnimationUtils.drawFrame(
                rootRef,
                channelRefs,
                defs,
                value,
                props.computeRootAnimation,
                props.computeChannelAnimation,
            ),
        );
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
</div>
