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
    _ScanlineHorizontalInterlaceOpts,
} from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

type Props = ScanlineAnimationExampleProps & {
    breakpointOpts: CellAnimationBreakpointOpts;
    keyframeOpts: _ScanlineHorizontalInterlaceOpts;
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeCellWeights = (count: Index2d) =>
    CellAnimationWeights.computeCellWeights(props.weightType, count, WEIGHT_ORIGIN);

const computeSliceAnimation = (defs: ScanlineAnimationEvaluationDefs, timeline: number) =>
    ScanlineAnimationKeyframes._computeHorizontalInterlace(
        CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, props.breakpointOpts),
        defs,
        timeline,
        props.keyframeOpts,
    );
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
        :compute-cell-weights="computeCellWeights"
        :compute-slice-animation="computeSliceAnimation"
    />
</template>
