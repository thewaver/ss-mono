<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef, useModel } from "vue";

import { ParticleSpawner, toElement } from "@thewaver/ss-components-vue";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const TARGET_TOPS = ["20%", "40%", "60%", "80%"];

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const targetRefs = shallowRef<(HTMLElement | undefined)[]>(TARGET_TOPS.map(() => undefined));

const targetRefSetters = TARGET_TOPS.map((_, index) => (target: Element | ComponentPublicInstance | null) => {
    const element = toElement(target);

    if (targetRefs.value[index] === element) return;

    targetRefs.value = targetRefs.value.map((ref, refIndex) => (refIndex === index ? element : ref));
});

const computeParticleStyle = (t: number) => {
    const glow = computeParticleGlow(t);

    return { opacity: glow.opacity, transform: `scale(${glow.scale})` };
};
</script>

<template>
    <div :class="styles.demoArea">
        <div
            v-for="(top, index) in TARGET_TOPS"
            :key="index"
            :ref="targetRefSetters[index]"
            :class="[styles.targetMarker, areTargetsHidden && styles.isHiddenMarker]"
            :style="{ left: '85%', top }"
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
                :targets="targetRefs"
            >
                <template #renderParticle="{ t }">
                    <div :class="styles.particle" :style="computeParticleStyle(t)" />
                </template>
            </ParticleSpawner>
        </div>
    </div>
</template>
