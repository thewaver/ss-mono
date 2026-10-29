<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

import { ScanlineAnimation, SliceAnimationKeyframeUtils, SliceAnimationWeights } from "@thewaver/ss-components-vue";
import type { SliceAnimationBreakpointTriple, SliceStop } from "@thewaver/ss-components-vue";
import type { Index2d } from "@thewaver/ss-utils";

import type { ScanlineAnimationExampleProps } from "../ScanlineAnimationPage.types";

const WEIGHT_ORIGIN = { row: 0, col: 0 };

const NO_STOPS: SliceStop[] = [];

const WHOLE_PASS = { smoothness: 1 };

const getGlitchBreakpointGroups = (count: number, start: number, end: number) => {
    const result: SliceAnimationBreakpointTriple[] = [];
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
const progress = useModel(props, "progress");

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

const computeSliceWeights = (count: Index2d) =>
    SliceAnimationWeights.computeSliceWeights(props.weightType, count, WEIGHT_ORIGIN);

const computeRootAnimation = (timeline: number) => {
    for (let g = 0; g < breakpointGroups.value.length; g++) {
        const [start, , end] = breakpointGroups.value[g];

        if (timeline >= start && timeline <= end) {
            return { brightness: 125 };
        }
    }

    return { brightness: 100 };
};

const animation = computed(() => {
    const groups = breakpointGroups.value;
    const rowStops = Array.from({ length: props.lineCount }, (_, row) =>
        groups.flatMap(([start, , end], group): SliceStop[] => {
            const shift = shifts.value[group]?.[row] ?? 0;

            return [
                { at: start, translateX: 0 },
                { at: start, translateX: shift },
                { at: end, translateX: shift },
                { at: end, translateX: 0 },
            ];
        }),
    );

    return SliceAnimationKeyframeUtils.fromSlices(({ pos }) => rowStops[pos.row] ?? NO_STOPS);
});
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
        :compute-root-animation="computeRootAnimation"
        :breakpoint-opts="WHOLE_PASS"
        :compute-slice-animation="animation"
        @iteration-end="regenerateShifts"
    />
</template>
