<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ParticleDissolve } from "@thewaver/ss-components-vue";
import {
    ASH_ANIMATION,
    ASH_SRC,
    CENTER_SHARE,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import type { Point2d } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ParticleDissolveExampleProps } from "../ParticleDissolvePageVue.types";

type Props = ParticleDissolveExampleProps;

defineProps<Props>();

const isDissolved = shallowRef(false);
const originShare = shallowRef<Point2d>(CENTER_SHARE);

const computePressShare = (e: MouseEvent | KeyboardEvent): Point2d => {
    const element = e.currentTarget;

    if (!(e instanceof MouseEvent) || e.detail === 0 || !(element instanceof HTMLElement)) return CENTER_SHARE;

    const rect = element.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return CENTER_SHARE;

    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
};

const burn = (e: MouseEvent | KeyboardEvent) => {
    originShare.value = computePressShare(e);
    isDissolved.value = true;
};

const rebuild = () => {
    isDissolved.value = false;
};
</script>

<template>
    <div id="particleDissolveButtonStage" :class="styles.stack">
        <ParticleDissolve
            :is-dissolved="isDissolved"
            :origin-share="originShare"
            :duration-ms="durationMs"
            :particle-lifetime-ms="particleLifetimeMs"
            :feather-share="featherShare"
            :spawn-chance="spawnChance"
            :cell-size="cellSize"
            :src="ASH_SRC"
            :compute-particle-animation="ASH_ANIMATION"
        >
            <Button id="particleDissolveBurn" @click="burn">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Click to burn me up</PageButtonContent>
                </template>
            </Button>
        </ParticleDissolve>

        <Button id="particleDissolveRebuild" @click="rebuild">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Rebuild</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
