<script setup lang="ts">
import { shallowRef } from "vue";

import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-vue";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import AngleKnob from "./AngleKnob.vue";
import CardExample from "./Examples/Card.vue";
import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageVue.types";

const props = defineProps<ParticleDissolveExampleProps>();

const angleDegrees = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);
</script>

<template>
    <CardExample v-bind="props" :angle-degrees="angleDegrees" />

    <PageExampleKnobs>
        <AngleKnob :value="angleDegrees" @input="(value: number) => (angleDegrees = value)" />
    </PageExampleKnobs>
</template>
