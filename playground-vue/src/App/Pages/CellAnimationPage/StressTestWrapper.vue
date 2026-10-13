<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import {
    STRESS_CELL_COUNT,
    STRESS_ITEMS,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import DefaultExample from "./Examples/Default.vue";

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
                <DefaultExample v-bind="sharedProps" v-model:playback="modalPlayback" :cell-count="STRESS_CELL_COUNT" />
            </PageMeasureBox>
        </template>
    </StressTest>
</template>
