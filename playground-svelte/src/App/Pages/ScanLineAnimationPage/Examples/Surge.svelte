<script lang="ts">
    import {
        SliceAnimationWeights,
        ScanlineAnimation,
        ScanlineAnimationKeyframes,
    } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationBreakpointOpts, ScanlineHorizontalStretchOpts } from "@thewaver/ss-components-svelte";
    import type { Count2d } from "@thewaver/ss-utils";

    import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

    const WEIGHT_ORIGIN = { row: 0, col: 0 };

    type Props = ScanlineAnimationExampleProps & {
        breakpointOpts: SliceAnimationBreakpointOpts;
        keyframeOpts: ScanlineHorizontalStretchOpts;
    };

    let { playback = $bindable(), progress = $bindable(0), keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props = $props();

    const computeSliceWeights = (count: Count2d) =>
        SliceAnimationWeights.computeSliceWeights(weightType, count, WEIGHT_ORIGIN);

    const animation = $derived(ScanlineAnimationKeyframes.createHorizontalStretch(keyframeOpts));
</script>

<ScanlineAnimation
    {...otherProps}
    bind:playback
    bind:progress
    {computeSliceWeights}
    {breakpointOpts}
    computeSliceAnimation={animation}
/>
