<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawner } from "@thewaver/ss-components-vue";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const targetRef = shallowRef<HTMLElement>();

const computeParticleStyle = (t: number) => {
    const glow = computeParticleGlow(t);

    return { opacity: glow.opacity, transform: `scale(${glow.scale})` };
};
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
                :retention-ms="retentionMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[targetRef]"
            >
                <template #renderParticle="{ t }">
                    <div :class="styles.particle" :style="computeParticleStyle(t)" />
                </template>
            </ParticleSpawner>
        </div>
    </div>
</template>
