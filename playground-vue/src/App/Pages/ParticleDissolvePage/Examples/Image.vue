<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ParticleDissolve } from "@thewaver/ss-components-vue";
import { computeAshAnimation } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import AshParticle from "../AshParticle.vue";
import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageVue.types";

type Props = ParticleDissolveAngleExampleProps;

defineProps<Props>();

const isDissolved = shallowRef(false);

const dissolve = () => {
    isDissolved.value = true;
};

const rebuild = () => {
    isDissolved.value = false;
};
</script>

<template>
    <div id="particleDissolveImageStage" :class="styles.stack">
        <ParticleDissolve
            :is-dissolved="isDissolved"
            :angle-degrees="angleDegrees"
            :duration-ms="durationMs"
            :particle-lifetime-ms="particleLifetimeMs"
            :feather-share="featherShare"
            :spawn-chance="spawnChance"
            :particles-per-cell="particlesPerCell"
            :cell-size="cellSize"
            :compute-particle-animation="computeAshAnimation"
        >
            <img :class="styles.image" :src="knight" alt="A knight" />

            <template #renderParticle="{ defs }">
                <AshParticle :defs="defs" />
            </template>
        </ParticleDissolve>

        <div :class="styles.buttonRow">
            <Button id="particleDissolveImageBurn" @click="dissolve">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Dissolve</PageButtonContent>
                </template>
            </Button>
            <Button id="particleDissolveImageRebuild" @click="rebuild">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Rebuild</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
