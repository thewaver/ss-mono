<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import WindExample from "./Examples/Wind.vue";
import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";
import ScrubbedExampleWrapper from "./ScrubbedExampleWrapper.vue";

const props = defineProps<{
    "exampleProps": Omit<ParticleSpawnerExampleProps, "playback">;
    "isPagePlaying": boolean;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
}>();

const playback = useModel(props, "playback");

const directionDegrees = shallowRef(ParticleSpawnerKnobs.STARTING_WIND_DIRECTION_DEGREES);
const strengthPixels = shallowRef(ParticleSpawnerKnobs.STARTING_WIND_STRENGTH_PIXELS);
const gustRatio = shallowRef(ParticleSpawnerKnobs.STARTING_WIND_GUST_RATIO);
</script>

<template>
    <ScrubbedExampleWrapper id="wind" :is-page-playing="isPagePlaying" v-model:playback="playback">
        <template #default="{ playback: examplePlayback, progress }">
            <WindExample
                v-bind="exampleProps"
                v-model:playback="examplePlayback.value"
                v-model:progress="progress.value"
                :wind-direction-degrees="directionDegrees"
                :wind-strength-pixels="strengthPixels"
                :wind-gust-ratio="gustRatio"
            />
        </template>
    </ScrubbedExampleWrapper>

    <PageExampleKnobs>
        <PageProp
            item-key="windDirectionDegrees"
            controls="Sets directionDegrees of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers"
            label="Direction (degrees)"
            hint="Which way the wind blows, in degrees clockwise from rightward. 90 blows down."
        >
            <PageNumberField
                :value="directionDegrees"
                :min="ParticleSpawnerKnobs.MIN_WIND_DIRECTION_DEGREES"
                :max="ParticleSpawnerKnobs.MAX_WIND_DIRECTION_DEGREES"
                :step="ParticleSpawnerKnobs.WIND_DIRECTION_STEP_DEGREES"
                :width="FIELD_WIDTH"
                ariaLabel="Wind direction in degrees"
                @input="(value: number) => (directionDegrees = value)"
            />
        </PageProp>

        <PageProp
            item-key="windStrengthPixels"
            controls="Sets strengthPixels of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers"
            label="Strength (px)"
            hint="How far a particle is carried off its path halfway along it, between gusts."
        >
            <PageNumberField
                :value="strengthPixels"
                :min="ParticleSpawnerKnobs.MIN_WIND_STRENGTH_PIXELS"
                :max="ParticleSpawnerKnobs.MAX_WIND_STRENGTH_PIXELS"
                :step="ParticleSpawnerKnobs.WIND_STRENGTH_STEP_PIXELS"
                :width="FIELD_WIDTH"
                ariaLabel="Wind strength in pixels"
                @input="(value: number) => (strengthPixels = value)"
            />
        </PageProp>

        <PageProp
            item-key="windGustRatio"
            controls="Sets gustRatio of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers"
            label="Gusts"
            hint="How much the strength swings above and below itself over time. 0 is a steady wind."
        >
            <PageNumberField
                :value="gustRatio"
                :min="ParticleSpawnerKnobs.MIN_WIND_GUST_RATIO"
                :max="ParticleSpawnerKnobs.MAX_WIND_GUST_RATIO"
                :step="ParticleSpawnerKnobs.WIND_GUST_RATIO_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Wind gusts"
                @input="(value: number) => (gustRatio = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
