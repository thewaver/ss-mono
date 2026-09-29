<script setup lang="ts">
import { useModel } from "vue";

import {
    CellAnimationBreakpointUtils,
    CellAnimationWeights,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
} from "@thewaver/ss-components-vue";
import type {
    CellAnimationBreakpointOpts,
    ScanlineAnimationEvaluationDefs,
    ScanlineHorizontalSplitOpts,
} from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: CellAnimationBreakpointOpts;
    keyframeOpts: ScanlineHorizontalSplitOpts;
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const computeCellWeights = (count: Index2d) =>
    CellAnimationWeights.computeCellWeights(props.weightType, count, WEIGHT_ORIGIN);

const computeScanlineAnimation = (defs: ScanlineAnimationEvaluationDefs, timeline: number) =>
    ScanlineAnimationKeyframes.computeHorizontalSplit(
        CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, props.breakpointOpts),
        defs,
        timeline,
        props.keyframeOpts,
    );
</script>

<template>
    <ScanlineAnimation
        v-model:playback="playback"
        :src="src"
        :line-count="lineCount"
        :orientation="orientation"
        :animation-duration-ms="animationDurationMs"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :compute-cell-weights="computeCellWeights"
        :compute-scanline-animation="computeScanlineAnimation"
    />
</template>
