<script setup lang="ts">
import { computed, useModel } from "vue";

import {
    CellAnimation,
    CellAnimationBreakpointUtils,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
} from "@thewaver/ss-components-vue";
import type { CellAnimationEvaluationDefs } from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

type Props = CellAnimationSourcedExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const origin = computed(() => CellAnimationOrigins.computeOrigin(props.originType, props.cellCount));

const computeCellWeights = (count: Index2d) =>
    CellAnimationWeights.computeCellWeights(props.weightType, count, origin.value, props.weightOpts);

const computeCellAnimation = (defs: CellAnimationEvaluationDefs, timeline: number) =>
    CellAnimationKeyframes.computeAnimation(
        props.animationType,
        CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, props.breakpointOpts),
        { ...defs, origin: origin.value },
        CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, props.animationDurationMs, props.playbackOpts),
        props.breakpointOpts.easing,
    );
</script>

<template>
    <CellAnimation
        v-model:playback="playback"
        v-model:progress="progress"
        :src="src"
        :cell-count="cellCount"
        :animation-iteration-count="animationIterationCount"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :final-frame="finalFrame"
        :animation-duration-ms="CellAnimationPlaybackUtils.computeCycleDurationMs(animationDurationMs, playbackOpts)"
        :compute-cell-weights="computeCellWeights"
        :compute-cell-animation="computeCellAnimation"
    />
</template>
