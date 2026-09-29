<script lang="ts">
    import {
        CellAnimationBreakpointUtils,
        CellAnimationWeights,
        ScanlineAnimation,
        ScanlineAnimationKeyframes,
    } from "@thewaver/ss-components-svelte";
    import type { CellAnimationBreakpointOpts, _ScanlineHorizontalRollOpts } from "@thewaver/ss-components-svelte";
    import type { Index2d } from "@thewaver/ss-utils";

    import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

    const WEIGHT_ORIGIN = { row: 0, col: 0 };

    type Props = ScanlineAnimationExampleProps & {
        breakpointOpts: CellAnimationBreakpointOpts;
        keyframeOpts: _ScanlineHorizontalRollOpts;
    };

    let { playback = $bindable(), keyframeOpts, breakpointOpts, weightType, ...otherProps }: Props = $props();

    const computeCellWeights = (count: Index2d) =>
        CellAnimationWeights.computeCellWeights(weightType, count, WEIGHT_ORIGIN);
</script>

<ScanlineAnimation
    {...otherProps}
    bind:playback
    {computeCellWeights}
    computeScanlineAnimation={(defs, timeline) =>
        ScanlineAnimationKeyframes._computeHorizontalRoll(
            CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, breakpointOpts),
            defs,
            timeline,
            keyframeOpts,
        )}
/>
