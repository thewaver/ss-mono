<script setup lang="ts">
import { shallowRef } from "vue";

import {
    STRESS_CELL_SIZE,
    STRESS_ITEMS,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageVue.types";
import StressCard from "./StressCard.vue";

const props = defineProps<ParticleDissolveExampleProps>();

const isOnGraphicsCard = shallowRef(true);
</script>

<template>
    <div>{{ `${STRESS_CELL_SIZE} px cells` }}</div>

    <PagePropsPanel scope="local" :has-reset="false">
        <PageProp
            item-key="onGraphicsCard"
            label="On the graphics card"
            hint="Draws each card's ash in one canvas, with each particle's motion worked out on the graphics card. Off, every particle is an element of its own."
            controls="Sets ParticleDissolveProps.renderer in the stress test"
        >
            <PageCheckField
                :value="isOnGraphicsCard"
                ariaLabel="On the graphics card"
                @change="(value: boolean) => (isOnGraphicsCard = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <StressTest :configs="STRESS_ITEMS">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} cards` }}</template>

        <template #renderItem>
            <StressCard v-bind="props" :is-on-graphics-card="isOnGraphicsCard" />
        </template>
    </StressTest>
</template>
