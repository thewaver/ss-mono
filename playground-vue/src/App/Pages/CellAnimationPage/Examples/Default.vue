<script setup lang="ts">
import { computed, useModel } from "vue";

import {
    CellAnimation,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SliceAnimationWeights,
} from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

type Props = CellAnimationSourcedExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const origin = computed(() => CellAnimationOrigins.computeOrigin(props.originType, props.cellCount));

const computeSliceWeights = (count: Index2d) =>
    SliceAnimationWeights.computeSliceWeights(props.weightType, count, origin.value, props.weightOpts);
</script>

<template>
    <CellAnimation
        v-model:playback="playback"
        v-model:progress="progress"
        :src="src"
        :cell-count="cellCount"
        :origin="origin"
        :breakpoint-opts="breakpointOpts"
        :playback-opts="playbackOpts"
        :renderer="renderer"
        :animation-iteration-count="animationIterationCount"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :final-frame="finalFrame"
        :animation-duration-ms="animationDurationMs"
        :compute-slice-weights="computeSliceWeights"
        :compute-slice-animation="CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType]"
    />
</template>
