<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import {
    STRESS_ITEMS,
    STRESS_PARTICLE_COUNT,
    STRESS_SPAWN_DELAY_MS,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import StressTest from "../../PageComponents/StressTest/StressTest.vue";
import SingleTargetExample from "./Examples/SingleTarget.vue";
import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";

type Props = ParticleSpawnerExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const modalPlayback = shallowRef(true);

const isOnGraphicsCard = shallowRef(true);
</script>

<template>
    <PagePropsPanel scope="local" :has-reset="false">
        <PageProp item-key="onGraphicsCard" v-bind="ParticleSpawnerKnobs.ON_GRAPHICS_CARD_TEXT">
            <PageCheckField
                :value="isOnGraphicsCard"
                ariaLabel="On the graphics card"
                @change="(value: boolean) => (isOnGraphicsCard = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <StressTest :configs="STRESS_ITEMS" @show-modal="playback = false" @hide-modal="playback = true">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} spawners` }}</template>

        <template #renderItem="{ configIndex }">
            <PageMeasureBox :width="STRESS_ITEMS[configIndex].size" :height="STRESS_ITEMS[configIndex].size">
                <SingleTargetExample
                    v-model:playback="modalPlayback"
                    :particle-count="STRESS_PARTICLE_COUNT"
                    :travel-duration-ms="travelDurationMs"
                    :rest-duration-ms="restDurationMs"
                    :spawn-delay-ms="STRESS_SPAWN_DELAY_MS"
                    :spawn-iteration-patterns="spawnIterationPatterns"
                    :compute-particle-pos="computeParticlePos"
                    :are-targets-hidden="areTargetsHidden"
                    :renderer="isOnGraphicsCard ? 'graphics_card' : 'elements'"
                />
            </PageMeasureBox>
        </template>
    </StressTest>
</template>
