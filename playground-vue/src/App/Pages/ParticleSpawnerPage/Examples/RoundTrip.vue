<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawner } from "@thewaver/ss-components-vue";
import type { ParticleSpawnerController } from "@thewaver/ss-components-vue";
import {
    computeParticleAnimation,
    createParticleSrc,
    createReturnParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
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

const particleSrc = createParticleSrc();
const returnParticleSrc = createReturnParticleSrc();
</script>

<template>
    <div :class="styles.demoArea">
        <div :class="styles.spawnerRoot" :style="{ left: '15%', top: '50%' }">
            <div ref="outboundMarker" :class="styles.spawnerMarker" />

            <ParticleSpawner
                v-model:playback="playback"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :rest-duration-ms="restDurationMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[returnMarker]"
                :src="particleSrc"
                :compute-particle-animation="computeParticleAnimation"
                :renderer="renderer"
                @particle-arrive="relay?.emit(RETURN_COUNT)"
            />
        </div>

        <div :class="styles.spawnerRoot" :style="{ left: '85%', top: '50%' }">
            <div ref="returnMarker" :class="styles.spawnerMarkerReturn" />

            <ParticleSpawner
                v-model:playback="isRelayPlaying"
                :particle-count="particleCount"
                :travel-duration-ms="travelDurationMs"
                :rest-duration-ms="restDurationMs"
                :spawn-delay-ms="spawnDelayMs"
                :spawn-iteration-patterns="spawnIterationPatterns"
                :compute-particle-pos="computeParticlePos"
                :targets="[outboundMarker]"
                :src="returnParticleSrc"
                :compute-particle-animation="computeParticleAnimation"
                :renderer="renderer"
                @mount="(controller: ParticleSpawnerController) => (relay = controller)"
            />
        </div>
    </div>
</template>
