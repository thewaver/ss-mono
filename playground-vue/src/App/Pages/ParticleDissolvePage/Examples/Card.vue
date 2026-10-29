<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ParticleDissolve } from "@thewaver/ss-components-vue";
import {
    ASH_ANIMATION,
    ASH_SRC,
    CARD_TEXT,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
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
    <div id="particleDissolveCardStage" :class="styles.stack">
        <ParticleDissolve
            :is-dissolved="isDissolved"
            :angle-degrees="angleDegrees"
            :duration-ms="durationMs"
            :particle-lifetime-ms="particleLifetimeMs"
            :feather-share="featherShare"
            :spawn-chance="spawnChance"
            :cell-size="cellSize"
            :src="ASH_SRC"
            :compute-particle-animation="ASH_ANIMATION"
        >
            <div :class="styles.card">
                <span id="particleDissolveCardTitle" :class="styles.cardTitle">{{ CARD_TEXT.title }}</span>
                <span>{{ CARD_TEXT.body }}</span>
                <span id="particleDissolveCardBadge" :class="styles.badge">{{ CARD_TEXT.badge }}</span>
            </div>
        </ParticleDissolve>

        <div :class="styles.buttonRow">
            <Button id="particleDissolveCardBurn" @click="dissolve">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Dissolve</PageButtonContent>
                </template>
            </Button>
            <Button id="particleDissolveCardRebuild" @click="rebuild">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Rebuild</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
