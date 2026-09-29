<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import type { Index2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import type { CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import DefaultExample from "./Examples/Default.vue";

const STRESS_CELL_COUNT: Index2d = { row: 11, col: 11 };
const STRESS_ITEM_SIZE = 120;
const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    {
        count: 4 * 3,
        cols: 4,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 6 * 4,
        cols: 6,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 8 * 6,
        cols: 8,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 12 * 6,
        cols: 12,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
];

type Props = CellAnimationSourcedExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const sharedProps = computed(() => {
    const { "playback": _playback, "onUpdate:playback": _setPlayback, ...shared } = props;

    return shared;
});

const resume = () => {
    playback.value = true;
};

const pause = () => {
    playback.value = false;
};
</script>

<template>
    <div>{{ `${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells` }}</div>

    <StressTest :configs="STRESS_ITEMS" @hide-modal="resume" @show-modal="pause">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} items` }}</template>

        <template #renderItem="{ configIndex }">
            <PageMeasureBox :width="STRESS_ITEMS[configIndex].size" :height="STRESS_ITEMS[configIndex].size">
                <DefaultExample
                    v-bind="sharedProps"
                    v-model:playback="modalPlayback"
                    :cell-count="STRESS_CELL_COUNT"
                />
            </PageMeasureBox>
        </template>
    </StressTest>
</template>
