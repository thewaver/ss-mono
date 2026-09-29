<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import type { Index2d } from "@thewaver/ss-utils";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import DefaultExample from "./Examples/Default.vue";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

const STRESS_CELL_COUNT: Index2d = { col: 11, row: 11 };
const STRESS_ITEM_SIZE = 120;
const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
];

const props = defineProps<ParticleFieldExampleProps>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const fieldProps = computed(() => ({
    spawnChance: props.spawnChance,
    animationIterationDelayMs: props.animationIterationDelayMs,
    animationDurationMs: props.animationDurationMs,
    particleLifetimeMs: props.particleLifetimeMs,
    originType: props.originType,
    weightType: props.weightType,
    animationType: props.animationType,
    holdShare: props.holdShare,
    isScattered: props.isScattered,
}));
</script>

<template>
    <div>{{ `${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells` }}</div>

    <StressTest :configs="STRESS_ITEMS" @show-modal="playback = false" @hide-modal="playback = true">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} fields` }}</template>

        <template #renderItem="{ configIndex }">
            <PageMeasureBox :width="STRESS_ITEMS[configIndex].size" :height="STRESS_ITEMS[configIndex].size">
                <DefaultExample v-bind="fieldProps" v-model:playback="modalPlayback" :cell-count="STRESS_CELL_COUNT" />
            </PageMeasureBox>
        </template>
    </StressTest>
</template>
