<script setup lang="ts">
import { computed, shallowRef, useModel, watch } from "vue";

import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-vue";
import type { CellAnimationBreakpointTriple, RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

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

const getRandomShifts = (breakpointGroupCount: number, shiftPercent: number) =>
    Array.from({ length: breakpointGroupCount }, () =>
        RGB_ANIMATION_CHANNELS.map(() => [
            Math.random() * shiftPercent * 2 - shiftPercent,
            Math.random() * shiftPercent * 2 - shiftPercent,
        ]),
    );

type Props = RGBAnimationExampleProps & {
    glitchOpts: { count: number; shiftPercent: number };
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const breakpointGroups = computed(() => {
    const count = props.glitchOpts.count;
    const shift = Math.min(0.25, count * 0.05);

    return getGlitchBreakpointGroups(count, 0.5 - shift, 0.5 + shift);
});

const generateShifts = () => getRandomShifts(breakpointGroups.value.length, props.glitchOpts.shiftPercent);

const shifts = shallowRef(generateShifts());

const regenerateShifts = () => {
    shifts.value = generateShifts();
};

watch([breakpointGroups, () => props.glitchOpts.shiftPercent], regenerateShifts);

const findGroup = (timeline: number) =>
    breakpointGroups.value.findIndex(([start, , end]) => timeline >= start && timeline <= end);

const computeRootAnimation = (timeline: number) => ({ brightness: findGroup(timeline) === -1 ? 100 : 125 });

const computeSliceAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => {
    const group = findGroup(timeline);
    const shift = shifts.value[group]?.[RGB_ANIMATION_CHANNELS.indexOf(defs.channel)];

    return { translate: shift ?? [0, 0] };
};
</script>

<template>
    <RGBAnimation
        v-model:playback="playback"
        v-model:progress="progress"
        :src="src"
        :aria-label="ariaLabel"
        :color-mixing="colorMixing"
        :animation-duration-ms="animationDurationMs"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :compute-root-animation="computeRootAnimation"
        :compute-slice-animation="computeSliceAnimation"
        @iteration-end="regenerateShifts"
    />
</template>
