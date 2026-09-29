<script lang="ts" module>
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

    const STRESS_LINE_COUNT = 120;

    export const STRESS_ITEMS: (StressTestDefs & { size: number; kind: "transform" | "filter" })[] = (
        ["transform", "filter"] as const
    )
        .map((kind) => [
            {
                count: 4 * 3,
                cols: 4,
                gap: 10,
                size: STRESS_LINE_COUNT,
                kind,
            },
            {
                count: 6 * 4,
                cols: 6,
                gap: 10,
                size: STRESS_LINE_COUNT,
                kind,
            },
            {
                count: 8 * 6,
                cols: 8,
                gap: 10,
                size: STRESS_LINE_COUNT,
                kind,
            },
            {
                count: 12 * 6,
                cols: 12,
                gap: 10,
                size: STRESS_LINE_COUNT,
                kind,
            },
        ])
        .flat();
</script>

<script lang="ts">
    import { untrack } from "svelte";

    import {
        CellAnimationBreakpointUtils,
        CellAnimationWeights,
        ScanlineAnimation,
        ScanlineAnimationKeyframes,
    } from "@thewaver/ss-components-svelte";
    import type { Index2d } from "@thewaver/ss-utils";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";

    const WEIGHT_ORIGIN = { row: 0, col: 0 };

    const pickStressKeyframes = (kind: "transform" | "filter") => {
        const random = Math.random() * 3;

        return kind === "transform"
            ? random < 1
                ? ScanlineAnimationKeyframes.computeHorizontalSnake
                : random < 2
                  ? ScanlineAnimationKeyframes.computeHorizontalSplit
                  : ScanlineAnimationKeyframes.computeHorizontalStretch
            : random < 1
              ? ScanlineAnimationKeyframes.computeHorizontalBrightness
              : random < 2
                ? ScanlineAnimationKeyframes.computeHorizontalHue
                : ScanlineAnimationKeyframes.computeHorizontalGrayscale;
    };

    type StressItemProps = Omit<ScanlineAnimationExampleProps, "playback"> & {
        configIndex: number;
        modalPlayback: boolean;
    };

    let { configIndex, modalPlayback = $bindable(), weightType, ...props }: StressItemProps = $props();

    const foo = untrack(() => pickStressKeyframes(STRESS_ITEMS[configIndex].kind));

    const computeCellWeights = (count: Index2d) =>
        CellAnimationWeights.computeCellWeights(weightType, count, WEIGHT_ORIGIN);
</script>

<PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
    <ScanlineAnimation
        {...props}
        bind:playback={modalPlayback}
        lineCount={STRESS_LINE_COUNT}
        animationIterationDelayMs={0}
        {computeCellWeights}
        computeScanlineAnimation={(defs, timeline) =>
            foo(CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, undefined), defs, timeline, undefined)}
    />
</PageMeasureBox>
