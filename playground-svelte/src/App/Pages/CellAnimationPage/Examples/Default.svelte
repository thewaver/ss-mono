<script lang="ts">
    import {
        CellAnimation,
        CellAnimationKeyframes,
        CellAnimationOrigins,
        SliceAnimationWeights,
    } from "@thewaver/ss-components-svelte";

    import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

    let {
        playback = $bindable(),
        progress = $bindable(0),
        animationType,
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
    {origin}
    computeSliceWeights={(count) => SliceAnimationWeights.computeSliceWeights(weightType, count, origin, weightOpts)}
    computeSliceAnimation={CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType]}
/>
