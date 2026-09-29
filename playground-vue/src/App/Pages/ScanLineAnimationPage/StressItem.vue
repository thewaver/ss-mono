<script lang="ts">
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";

export const STRESS_LINE_COUNT = 120;
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

<script setup lang="ts">
import { useModel } from "vue";

import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
} from "@thewaver/ss-components-vue";
import type { ScanlineAnimationEvaluationDefs } from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
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

type Props = ScanlineAnimationExampleProps & {
    "configIndex": number;
    "modalPlayback": boolean;
    "onUpdate:modalPlayback"?: (isPlaying: boolean) => void;
};

const props = defineProps<Props>();

const modalPlayback = useModel(props, "modalPlayback");

const foo = pickStressKeyframes(STRESS_ITEMS[props.configIndex].kind);

const computeCellWeights = (count: Index2d) =>
    CellAnimationWeights.computeCellWeights(props.weightType, count, WEIGHT_ORIGIN);

const computeScanlineAnimation = (defs: ScanlineAnimationEvaluationDefs, timeline: number) =>
    foo(CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, undefined), defs, timeline, undefined);
</script>

<template>
    <PageMeasureBox :width="STRESS_ITEMS[configIndex].size" :height="STRESS_ITEMS[configIndex].size">
        <ScanlineAnimation
            v-model:playback="modalPlayback"
            :src="src"
            :orientation="orientation"
            :animation-duration-ms="animationDurationMs"
            :line-count="STRESS_LINE_COUNT"
            :animation-iteration-delay-ms="0"
            :compute-cell-weights="computeCellWeights"
            :compute-scanline-animation="computeScanlineAnimation"
        />
    </PageMeasureBox>
</template>
