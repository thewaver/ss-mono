<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { ParticleModifierUtils, ParticleSpawner } from "@thewaver/ss-components-vue";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { WindExampleProps } from "../ParticleSpawnerPage.types";

type Props = WindExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const targetRef = shallowRef<HTMLElement>();

const particleSrc = createParticleSrc();

const modifiers = computed(() => [
    ParticleModifierUtils.createWind({
        directionDegrees: props.windDirectionDegrees,
        strengthPixels: props.windStrengthPixels,
        gustRatio: props.windGustRatio,
    }),
]);
</script>

<template>
    <div :class="styles.demoArea">
        <div
            ref="targetRef"
            :class="[styles.targetMarker, areTargetsHidden && styles.isHiddenMarker]"
            :style="{ left: '85%', top: '50%' }"
        />

        <div
            :class="styles.windArrow"
            :style="{ width: `${windStrengthPixels}px`, transform: `rotate(${windDirectionDegrees}deg)` }"
        />

        <div :class="styles.spawnerRoot" :style="{ left: '15%', top: '50%' }">
            <div :class="styles.spawnerMarker" />

            <ParticleSpawner
                v-model:playback="playback"
                v-model:progress="progress"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :rest-duration-ms="restDurationMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[targetRef]"
                :src="particleSrc"
                :particle-modifiers="modifiers"
                :compute-particle-animation="computeParticleAnimation"
                :renderer="renderer"
            />
        </div>
    </div>
</template>
