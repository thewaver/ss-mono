<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawner } from "@thewaver/ss-components-vue";
import type { ParticleSpawnerController } from "@thewaver/ss-components-vue";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const RETURN_COUNT = 1;

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const outboundMarker = shallowRef<HTMLElement>();
const returnMarker = shallowRef<HTMLElement>();
const relay = shallowRef<ParticleSpawnerController>();
const isRelayPlaying = shallowRef(false);

const computeParticleStyle = (t: number) => {
    const glow = computeParticleGlow(t);

    return { opacity: glow.opacity, transform: `scale(${glow.scale})` };
};
</script>

<template>
    <div :class="styles.demoArea">
        <div :class="styles.spawnerRoot" :style="{ left: '15%', top: '50%' }">
            <div ref="outboundMarker" :class="styles.spawnerMarker" />

            <ParticleSpawner
                v-model:playback="playback"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :retention-ms="retentionMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[returnMarker]"
                @particle-arrive="relay?.emit(RETURN_COUNT)"
            >
                <template #renderParticle="{ t }">
                    <div :class="styles.particle" :style="computeParticleStyle(t)" />
                </template>
            </ParticleSpawner>
        </div>

        <div :class="styles.spawnerRoot" :style="{ left: '85%', top: '50%' }">
            <div ref="returnMarker" :class="styles.spawnerMarker" />

            <ParticleSpawner
                v-model:playback="isRelayPlaying"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :retention-ms="retentionMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[outboundMarker]"
                @mount="(controller: ParticleSpawnerController) => (relay = controller)"
            >
                <template #renderParticle="{ t }">
                    <div :class="styles.particleReturn" :style="computeParticleStyle(t)" />
                </template>
            </ParticleSpawner>
        </div>
    </div>
</template>
