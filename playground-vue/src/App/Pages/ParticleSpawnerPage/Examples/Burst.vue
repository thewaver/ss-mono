<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef } from "vue";

import { Button, ParticleSpawner, toElement } from "@thewaver/ss-components-vue";
import type { ParticleSpawnIterationPattern } from "@thewaver/ss-components-vue";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const ONE_ROUND: ParticleSpawnIterationPattern[] = [{ count: 1 }];

const TARGET_POSITIONS = [
    { left: "50%", top: "15%" },
    { left: "80%", top: "30%" },
    { left: "80%", top: "70%" },
    { left: "50%", top: "85%" },
    { left: "20%", top: "70%" },
    { left: "20%", top: "30%" },
];

type Props = ParticleSpawnerExampleProps;

defineProps<Props>();

const isPlaying = shallowRef(false);

const burst = () => {
    isPlaying.value = true;
};

const targetRefs = shallowRef<(HTMLElement | undefined)[]>(TARGET_POSITIONS.map(() => undefined));

const targetRefSetters = TARGET_POSITIONS.map((_, index) => (target: Element | ComponentPublicInstance | null) => {
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
            v-for="(position, index) in TARGET_POSITIONS"
            :key="index"
            :ref="targetRefSetters[index]"
            :class="[styles.targetMarker, areTargetsHidden && styles.isHiddenMarker]"
            :style="position"
        />

        <div :class="styles.burstRoot" :style="{ left: '50%', top: '50%' }">
            <Button id="particleBurst" @click="burst">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Burst</PageButtonContent>
                </template>
            </Button>

            <div :class="styles.spawnerOverlay">
                <ParticleSpawner
                    v-model:playback="isPlaying"
                    :particle-count="particleCount"
                    :travel-duration-ms="travelDurationMs"
                    :rest-duration-ms="restDurationMs"
                    :spawn-delay-ms="spawnDelayMs"
                    :spawn-iteration-patterns="ONE_ROUND"
                    :compute-particle-pos="computeParticlePos"
                    :targets="targetRefs"
                    @animation-end="isPlaying = false"
                >
                    <template #renderParticle="{ t }">
                        <div :class="styles.particle" :style="computeParticleStyle(t)" />
                    </template>
                </ParticleSpawner>
            </div>
        </div>
    </div>
</template>
