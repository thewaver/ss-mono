<script lang="ts">
    import {
        SliceAnimationWeights,
        ScanlineAnimation,
        ScanlineAnimationKeyframes,
    } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationBreakpointOpts, _ScanlineHorizontalSkewOpts } from "@thewaver/ss-components-svelte";
    import type { Index2d } from "@thewaver/ss-utils";

    import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

    const WEIGHT_ORIGIN = { row: 0, col: 0 };

    type Props = ScanlineAnimationExampleProps & {
        breakpointOpts: SliceAnimationBreakpointOpts;
        keyframeOpts: _ScanlineHorizontalSkewOpts;
    };

    let { playback = $bindable(), progress = $bindable(0), keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props = $props();

    const computeSliceWeights = (count: Index2d) =>
        SliceAnimationWeights.computeSliceWeights(weightType, count, WEIGHT_ORIGIN);

    const animation = $derived(ScanlineAnimationKeyframes._createHorizontalSkew(keyframeOpts));
</script>

<ScanlineAnimation
    {...otherProps}
    bind:playback
    bind:progress
    {computeSliceWeights}
    {breakpointOpts}
    computeSliceAnimation={animation}
/>
