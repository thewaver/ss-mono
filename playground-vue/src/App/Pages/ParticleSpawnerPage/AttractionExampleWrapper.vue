<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AttractionExample from "./Examples/Attraction.vue";
import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";
import ScrubbedExampleWrapper from "./ScrubbedExampleWrapper.vue";

const props = defineProps<{
    "exampleProps": Omit<ParticleSpawnerExampleProps, "playback">;
    "isPagePlaying": boolean;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
}>();

const playback = useModel(props, "playback");

const strengthRatio = shallowRef(ParticleSpawnerKnobs.STARTING_ATTRACTION_STRENGTH_RATIO);
const reachPixels = shallowRef(ParticleSpawnerKnobs.STARTING_ATTRACTION_REACH_PIXELS);
</script>

<template>
    <ScrubbedExampleWrapper id="attraction" :is-page-playing="isPagePlaying" v-model:playback="playback">
        <template #default="{ playback: examplePlayback, progress }">
            <AttractionExample
                v-bind="exampleProps"
                v-model:playback="examplePlayback.value"
                v-model:progress="progress.value"
                :attraction-strength-ratio="strengthRatio"
                :attraction-reach-pixels="reachPixels"
            />
        </template>
    </ScrubbedExampleWrapper>

    <PageExampleKnobs>
        <PageProp
            item-key="attractionStrengthRatio"
            controls="Sets strengthRatio of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers"
            label="Strength"
            hint="How much of the way to the ring a particle passing right by it is drawn."
        >
            <PageNumberField
                :value="strengthRatio"
                :min="ParticleSpawnerKnobs.MIN_ATTRACTION_STRENGTH_RATIO"
                :max="ParticleSpawnerKnobs.MAX_ATTRACTION_STRENGTH_RATIO"
                :step="ParticleSpawnerKnobs.ATTRACTION_STRENGTH_RATIO_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Attraction strength"
                @input="(value: number) => (strengthRatio = value)"
            />
        </PageProp>

        <PageProp
            item-key="attractionReachPixels"
            controls="Sets reachPixels of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers"
            label="Reach (px)"
            hint="How far from the ring the pull is felt at all. Particles passing farther away are left alone."
        >
            <PageNumberField
                :value="reachPixels"
                :min="ParticleSpawnerKnobs.MIN_ATTRACTION_REACH_PIXELS"
                :max="ParticleSpawnerKnobs.MAX_ATTRACTION_REACH_PIXELS"
                :step="ParticleSpawnerKnobs.ATTRACTION_REACH_STEP_PIXELS"
                :width="FIELD_WIDTH"
                ariaLabel="Attraction reach in pixels"
                @input="(value: number) => (reachPixels = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
