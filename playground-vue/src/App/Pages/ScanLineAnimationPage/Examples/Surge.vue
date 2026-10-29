<script setup lang="ts">
import { computed, useModel } from "vue";

import { ScanlineAnimation, ScanlineAnimationKeyframes, SliceAnimationWeights } from "@thewaver/ss-components-vue";
import type { ScanlineHorizontalStretchOpts, SliceAnimationBreakpointOpts } from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: SliceAnimationBreakpointOpts;
    keyframeOpts: ScanlineHorizontalStretchOpts;
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeSliceWeights = (count: Index2d) =>
    SliceAnimationWeights.computeSliceWeights(props.weightType, count, WEIGHT_ORIGIN);

const animation = computed(() => ScanlineAnimationKeyframes.createHorizontalStretch(props.keyframeOpts));
</script>

<template>
    <ScanlineAnimation
        v-model:playback="playback"
        v-model:progress="progress"
        :src="src"
        :line-count="lineCount"
        :orientation="orientation"
        :animation-duration-ms="animationDurationMs"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :compute-slice-weights="computeSliceWeights"
        :breakpoint-opts="breakpointOpts"
        :compute-slice-animation="animation"
    />
</template>
