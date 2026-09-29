<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import SingleTargetExample from "./Examples/SingleTarget.vue";
import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";

const STRESS_BOX_WIDTH = 120;
const STRESS_BOX_HEIGHT = 80;

const STRESS_ITEMS: (StressTestDefs & { width: number; height: number })[] = [
    { count: 8, cols: 4, gap: 10, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    { count: 24, cols: 6, gap: 8, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    { count: 48, cols: 8, gap: 6, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    { count: 96, cols: 12, gap: 4, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
];

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);
</script>

<template>
    <StressTest :configs="STRESS_ITEMS" @show-modal="playback = false" @hide-modal="playback = true">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} spawners` }}</template>

        <template #renderItem="{ configIndex }">
            <div
                :style="{
                    width: `${STRESS_ITEMS[configIndex].width}px`,
                    height: `${STRESS_ITEMS[configIndex].height}px`,
                }"
            >
                <SingleTargetExample
                    v-model:playback="modalPlayback"
                    :particle-count="particleCount"
                    :travel-duration-ms="travelDurationMs"
                    :retention-ms="retentionMs"
                    :spawn-delay-ms="spawnDelayMs"
                    :spawn-iteration-patterns="spawnIterationPatterns"
                    :compute-particle-pos="computeParticlePos"
                    :are-targets-hidden="areTargetsHidden"
                />
            </div>
        </template>
    </StressTest>
</template>
