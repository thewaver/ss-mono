<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { type ParticleRouteStop, ParticleSpawner } from "@thewaver/ss-components-vue";
import {
    computeParticleAnimation,
    createLegTints,
    createTintableParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const OUT_AND_BACK: ParticleRouteStop[] = [0, "spawner"];

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const targetRef = shallowRef<HTMLElement>();

const particleSrc = createTintableParticleSrc();
const legTints = createLegTints();
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
                v-model:progress="progress"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :rest-duration-ms="restDurationMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[targetRef]"
                :src="particleSrc"
                :compute-route="() => OUT_AND_BACK"
                :compute-particle-tint="(defs) => legTints[defs.legIndex % legTints.length]"
                :compute-particle-animation="computeParticleAnimation"
                :renderer="renderer"
            />
        </div>
    </div>
</template>
