<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { STRESS_ITEMS } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import SingleTargetExample from "./Examples/SingleTarget.vue";
import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";

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
                    :rest-duration-ms="restDurationMs"
                    :spawn-delay-ms="spawnDelayMs"
                    :spawn-iteration-patterns="spawnIterationPatterns"
                    :compute-particle-pos="computeParticlePos"
                    :are-targets-hidden="areTargetsHidden"
                />
            </div>
        </template>
    </StressTest>
</template>
