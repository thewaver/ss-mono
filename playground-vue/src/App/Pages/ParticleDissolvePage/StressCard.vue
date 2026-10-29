<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from "vue";

import { ParticleDissolve } from "@thewaver/ss-components-vue";
import {
    ASH_ANIMATION,
    ASH_SRC,
    CARD_TEXT,
    STRESS_CELL_SIZE,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageVue.types";

type Props = ParticleDissolveExampleProps & { isOnGraphicsCard: boolean };

defineProps<Props>();

const isDissolved = shallowRef(false);

let timeout: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
    timeout = setTimeout(() => {
        isDissolved.value = true;
    });
});

onUnmounted(() => clearTimeout(timeout));
</script>

<template>
    <ParticleDissolve
        :src="ASH_SRC"
        :is-dissolved="isDissolved"
        :duration-ms="durationMs"
        :particle-lifetime-ms="particleLifetimeMs"
        :feather-share="featherShare"
        :spawn-chance="spawnChance"
        :cell-size="STRESS_CELL_SIZE"
        :renderer="isOnGraphicsCard ? 'graphics_card' : 'elements'"
        :compute-particle-animation="ASH_ANIMATION"
        @dissolve-end="isDissolved = false"
        @rebuild-end="isDissolved = true"
    >
        <div :class="styles.card">
            <span :class="styles.cardTitle">{{ CARD_TEXT.title }}</span>
            <span>{{ CARD_TEXT.body }}</span>
            <span :class="styles.badge">{{ CARD_TEXT.badge }}</span>
        </div>
    </ParticleDissolve>
</template>
