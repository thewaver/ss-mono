<script lang="ts" module>
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressTextSvelte.types";

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

    import { SliceAnimationWeights, ScanlineAnimation, ScanlineAnimationKeyframes } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationRenderer } from "@thewaver/ss-components-svelte";
    import type { Index2d } from "@thewaver/ss-utils";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import { WEIGHT_ORIGIN } from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";

    const pickStressKeyframes = (kind: "transform" | "filter") => {
        const random = Math.random() * 3;

        return kind === "transform"
            ? random < 1
                ? ScanlineAnimationKeyframes.createHorizontalSnake()
                : random < 2
                  ? ScanlineAnimationKeyframes.createHorizontalSplit()
                  : ScanlineAnimationKeyframes.createHorizontalStretch()
            : random < 1
              ? ScanlineAnimationKeyframes.createHorizontalBrightness()
              : random < 2
                ? ScanlineAnimationKeyframes.createHorizontalHue()
                : ScanlineAnimationKeyframes.createHorizontalGrayscale();
    };

    type StressItemProps = Omit<ScanlineAnimationExampleProps, "playback"> & {
        configIndex: number;
        modalPlayback: boolean;
        renderer: SliceAnimationRenderer;
    };

    let { configIndex, modalPlayback = $bindable(), weightType, ...props }: StressItemProps = $props();

    const animation = untrack(() => pickStressKeyframes(STRESS_ITEMS[configIndex].kind));

    const computeSliceWeights = (count: Index2d) =>
        SliceAnimationWeights.computeSliceWeights(weightType, count, WEIGHT_ORIGIN);
</script>

<PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
    <ScanlineAnimation
        {...props}
        bind:playback={modalPlayback}
        lineCount={STRESS_LINE_COUNT}
        animationIterationDelayMs={0}
        {computeSliceWeights}
        computeSliceAnimation={animation}
    />
</PageMeasureBox>
