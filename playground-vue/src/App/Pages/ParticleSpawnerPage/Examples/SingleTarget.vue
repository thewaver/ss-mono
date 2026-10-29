<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawner } from "@thewaver/ss-components-vue";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const targetRef = shallowRef<HTMLElement>();

const particleSrc = createParticleSrc();
</script>

<template>
    <div :class="styles.demoArea">
        <div
            ref="targetRef"
            :class="[styles.targetMarker, areTargetsHidden && styles.isHiddenMarker]"
            :style="{ left: '85%', top: '50%' }"
        />

        <div :class="styles.spawnerRoot" :style="{ left: '15%', top: '50%' }">
            <div :class="styles.spawnerMarker" />

            <ParticleSpawner
                v-model:playback="playback"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :rest-duration-ms="restDurationMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[targetRef]"
                :src="particleSrc"
                :compute-particle-animation="computeParticleAnimation"
                :renderer="renderer"
            />
        </div>
    </div>
</template>
