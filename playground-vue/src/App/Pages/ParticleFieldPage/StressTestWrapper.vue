<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import {
    STRESS_CELL_COUNT,
    STRESS_ITEMS,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import DefaultExample from "./Examples/Default.vue";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

const props = defineProps<ParticleFieldExampleProps>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const isOnGraphicsCard = shallowRef(true);

const fieldProps = computed(() => ({
    spawnChance: props.spawnChance,
    animationIterationDelayMs: props.animationIterationDelayMs,
    animationDurationMs: props.animationDurationMs,
    particleLifetimeMs: props.particleLifetimeMs,
    originType: props.originType,
    weightType: props.weightType,
    animationType: props.animationType,
    holdShare: props.holdShare,
    isScattered: props.isScattered,
}));
</script>

<template>
    <div>{{ `${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells` }}</div>

    <PagePropsPanel scope="local" :has-reset="false">
        <PageProp
            item-key="onGraphicsCard"
            label="On the graphics card"
            hint="Draws the stress test's particles in one canvas per field, with the keyframes worked out on the graphics card. Off, every particle is an element of its own."
            controls="Sets ParticleFieldProps.renderer in the stress test"
        >
            <PageCheckField
                :value="isOnGraphicsCard"
                ariaLabel="On the graphics card"
                @change="(value: boolean) => (isOnGraphicsCard = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <StressTest :configs="STRESS_ITEMS" @show-modal="playback = false" @hide-modal="playback = true">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} fields` }}</template>

        <template #renderItem="{ configIndex }">
            <PageMeasureBox :width="STRESS_ITEMS[configIndex].size" :height="STRESS_ITEMS[configIndex].size">
                <DefaultExample
                    v-bind="fieldProps"
                    v-model:playback="modalPlayback"
                    :cell-count="STRESS_CELL_COUNT"
                    :renderer="isOnGraphicsCard ? 'graphics_card' : 'elements'"
                />
            </PageMeasureBox>
        </template>
    </StressTest>
</template>
