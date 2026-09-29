<script lang="ts">
    import {
        CellAnimation,
        CellAnimationBreakpointUtils,
        CellAnimationKeyframes,
        CellAnimationOrigins,
        CellAnimationPlaybackUtils,
        CellAnimationWeights,
    } from "@thewaver/ss-components-svelte";

    import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

    let {
        playback = $bindable(),
        progress = $bindable(0),
        animationType,
        breakpointOpts,
        playbackOpts,
        originType,
        weightType,
        weightOpts,
        ...otherProps
    }: CellAnimationSourcedExampleProps = $props();

    const origin = $derived(CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount));
</script>

<CellAnimation
    {...otherProps}
    bind:playback
    bind:progress
    animationDurationMs={CellAnimationPlaybackUtils.computeCycleDurationMs(
        otherProps.animationDurationMs,
        playbackOpts,
    )}
    computeCellWeights={(count) => CellAnimationWeights.computeCellWeights(weightType, count, origin, weightOpts)}
    computeCellAnimation={(defs, timeline) =>
        CellAnimationKeyframes.computeAnimation(
            animationType,
            CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, breakpointOpts),
            { ...defs, origin },
            CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, otherProps.animationDurationMs, playbackOpts),
            breakpointOpts.easing,
        )}
/>
