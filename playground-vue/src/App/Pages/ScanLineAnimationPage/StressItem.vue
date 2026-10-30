<script lang="ts">
import type { StressTestDefs } from "../../PageComponents/StressTest/StressTextVue.types";

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

import { ScanlineAnimation, ScanlineAnimationKeyframes, SliceAnimationWeights } from "@thewaver/ss-components-vue";
import type { SliceAnimationRenderer } from "@thewaver/ss-components-vue";
import {
    STRESS_ITERATION_DELAY_MS,
    WEIGHT_ORIGIN,
} from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import type { Index2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";

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

type Props = ScanlineAnimationExampleProps & {
    "configIndex": number;
    "modalPlayback": boolean;
    "renderer": SliceAnimationRenderer;
    "onUpdate:modalPlayback"?: (isPlaying: boolean) => void;
};

const props = defineProps<Props>();

const modalPlayback = useModel(props, "modalPlayback");

const animation = pickStressKeyframes(STRESS_ITEMS[props.configIndex].kind);

const computeSliceWeights = (count: Index2d) =>
    SliceAnimationWeights.computeSliceWeights(props.weightType, count, WEIGHT_ORIGIN);
</script>

<template>
    <PageMeasureBox :width="STRESS_ITEMS[configIndex].size" :height="STRESS_ITEMS[configIndex].size">
        <ScanlineAnimation
            v-model:playback="modalPlayback"
            :src="src"
            :orientation="orientation"
            :animation-duration-ms="animationDurationMs"
            :line-count="STRESS_LINE_COUNT"
            :animation-iteration-delay-ms="STRESS_ITERATION_DELAY_MS"
            :renderer="renderer"
            :compute-slice-weights="computeSliceWeights"
            :compute-slice-animation="animation"
        />
    </PageMeasureBox>
</template>
