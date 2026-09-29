<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

import { CellAnimationWeights, ScanlineAnimation } from "@thewaver/ss-components-vue";
import type { CellAnimationBreakpointTriple, ScanlineAnimationEvaluationDefs } from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

const getGlitchBreakpointGroups = (count: number, start: number, end: number) => {
    const result: CellAnimationBreakpointTriple[] = [];
    const range = end - start;
    const segmentWidth = range / count;

    for (let i = 0; i < count; i++) {
        const segmentStart = start + i * segmentWidth;
        const segmentMid = segmentStart + segmentWidth * 0.5;
        const segmentEnd = segmentStart + segmentWidth;

        result.push([Number(segmentStart.toFixed(3)), Number(segmentMid.toFixed(3)), Number(segmentEnd.toFixed(3))]);
    }

    return result;
};

const getRandomShifts = (breakpointGroupCount: number, lineCount: number, shiftPercent: number, chunkyness: number) => {
    let lastShift: number | undefined;

    return Array.from({ length: breakpointGroupCount }, () =>
        Array.from({ length: lineCount }, () => {
            if (lastShift === undefined || Math.random() > chunkyness) {
                lastShift = Math.random() * shiftPercent * 2 - shiftPercent;
            }

            return lastShift;
        }),
    );
};

type Props = ScanlineAnimationExampleProps & {
    keyframeOpts: { count: number; shiftPercent: number; chunkyness: number };
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const breakpointGroups = computed(() => {
    const count = props.keyframeOpts.count;
    const shift = Math.min(0.25, count * 0.05);

    return getGlitchBreakpointGroups(count, 0.5 - shift, 0.5 + shift);
});

const generateShifts = () =>
    getRandomShifts(
        breakpointGroups.value.length,
        props.lineCount,
        props.keyframeOpts.shiftPercent,
        props.keyframeOpts.chunkyness,
    );

const shifts = shallowRef(generateShifts());

const regenerateShifts = () => {
    shifts.value = generateShifts();
};

watch(
    [
        breakpointGroups,
        () => props.lineCount,
        () => props.keyframeOpts.shiftPercent,
        () => props.keyframeOpts.chunkyness,
    ],
    regenerateShifts,
);

const computeCellWeights = (count: Index2d) =>
    CellAnimationWeights.computeCellWeights(props.weightType, count, WEIGHT_ORIGIN);

const computeRootAnimation = (timeline: number) => {
    for (let g = 0; g < breakpointGroups.value.length; g++) {
        const [start, , end] = breakpointGroups.value[g];

        if (timeline >= start && timeline <= end) {
            return { brightness: 125 };
        }
    }

    return { brightness: 100 };
};

const computeScanlineAnimation = (defs: ScanlineAnimationEvaluationDefs, timeline: number) => {
    for (let g = 0; g < breakpointGroups.value.length; g++) {
        const [start, , end] = breakpointGroups.value[g];

        if (timeline >= start && timeline <= end) {
            const shiftGroup = shifts.value[g];
            const shiftVal = shiftGroup ? (shiftGroup[defs.pos.row] ?? 0) : 0;

            return { translateX: shiftVal };
        }
    }

    return { translateX: 0 };
};
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
        :compute-root-animation="computeRootAnimation"
        :compute-scanline-animation="computeScanlineAnimation"
        @iteration-end="regenerateShifts"
    />
</template>
