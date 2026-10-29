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

const settings = computed(() => ({
    animationType: props.animationType,
    breakpointOpts: { ...props.breakpointOpts },
    playbackOpts: { ...props.playbackOpts },
    durationMs: props.animationDurationMs,
    origin: origin.value,
}));

const cellsWithOrigin = new WeakMap<CellAnimationEvaluationDefs, CellAnimationEvaluationDefs & { origin: Index2d }>();

const computeFrame = (timeline: number, frameSettings: typeof settings.value) => ({
    timeline,
    settings: frameSettings,
    breakpointOpts: CellAnimationPlaybackUtils.computeBreakpointOpts(
        frameSettings.breakpointOpts,
        timeline,
        frameSettings.playbackOpts,
    ),
    globalTimeline: CellAnimationPlaybackUtils.computeGlobalTimeline(
        timeline,
        frameSettings.durationMs,
        frameSettings.playbackOpts,
    ),
});

let frame: ReturnType<typeof computeFrame> | undefined;

const getFrame = (timeline: number) => {
    const current = settings.value;

    if (frame?.timeline !== timeline || frame.settings !== current) frame = computeFrame(timeline, current);

    return frame;
};

const withOrigin = (defs: CellAnimationEvaluationDefs, cellOrigin: Index2d) => {
    const cached = cellsWithOrigin.get(defs);

    if (cached?.origin === cellOrigin) return cached;

    const cell = { ...defs, origin: cellOrigin };

    cellsWithOrigin.set(defs, cell);

    return cell;
};

const computeSliceAnimation = (defs: CellAnimationEvaluationDefs, timeline: number) => {
    const { settings: frameSettings, breakpointOpts, globalTimeline } = getFrame(timeline);

    return CellAnimationKeyframes.computeAnimation(
        frameSettings.animationType,
        CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, breakpointOpts),
        withOrigin(defs, frameSettings.origin),
        globalTimeline,
        frameSettings.breakpointOpts.easing,
    );
};
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
        :compute-slice-animation="computeSliceAnimation"
    />
</template>
