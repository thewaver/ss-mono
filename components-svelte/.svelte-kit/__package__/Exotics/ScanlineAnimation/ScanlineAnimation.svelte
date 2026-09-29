<script lang="ts">
    import { SCANLINE_ANIMATION_DEFAULTS } from "@thewaver/ss-components";

    import CellAnimation from "../CellAnimation/CellAnimation.svelte";
    import type { ScanlineAnimationProps } from "./ScanlineAnimation.types.js";

    const NO_PROGRESS = 0;

    let {
        playback = $bindable(true),
        progress = $bindable(NO_PROGRESS),
        lineCount,
        orientation,
        computeScanlineAnimation,
        ...otherProps
    }: ScanlineAnimationProps = $props();

    const isVertical = $derived((orientation ?? SCANLINE_ANIMATION_DEFAULTS.orientation) === "vertical");
</script>

<CellAnimation
    {...otherProps}
    bind:playback
    bind:progress
    cellCount={isVertical ? { row: 1, col: lineCount } : { row: lineCount, col: 1 }}
    computeCellAnimation={computeScanlineAnimation}
/>
