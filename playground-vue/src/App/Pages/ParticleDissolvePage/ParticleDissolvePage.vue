<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-vue";
import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import CardExampleWrapper from "./CardExampleWrapper.vue";
import ButtonExample from "./Examples/Button.vue";
import ImageExampleWrapper from "./ImageExampleWrapper.vue";
import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageVue.types";
import StressTestWrapper from "./StressTestWrapper.vue";
import SvgExampleWrapper from "./SvgExampleWrapper.vue";

const durationMs = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.durationMs);
const particleLifetimeMs = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs);
const featherShare = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.featherShare);
const spawnChance = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.spawnChance);
const cellSize = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.cellSize);

const commonProps = computed<ParticleDissolveExampleProps>(() => ({
    durationMs: durationMs.value,
    particleLifetimeMs: particleLifetimeMs.value,
    featherShare: featherShare.value,
    spawnChance: spawnChance.value,
    cellSize: cellSize.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "button",
        name: EXAMPLE_NAMES.button,
        readout: () => "burns away outward from the point it was pressed, and the Rebuild button brings it back",
        path: `${EXAMPLES_ROOT}/Button.vue`,
    },
    {
        key: "card",
        name: EXAMPLE_NAMES.card,
        readout: () =>
            "dissolves along a straight edge at the angle set in this example's knobs; particles rise only from the text and the painted boxes, never from the empty parts of the card",
        path: `${EXAMPLES_ROOT}/Card.vue`,
    },
    {
        key: "svg",
        name: EXAMPLE_NAMES.svg,
        readout: () =>
            "an SVG shape, read point by point against its fill and stroke, so a triangle sheds ash only from the triangle",
        path: `${EXAMPLES_ROOT}/Svg.vue`,
    },
    {
        key: "image",
        name: EXAMPLE_NAMES.image,
        readout: () =>
            "a picture, read pixel by pixel: ash rises only from what is shown, in the colors it is shown in, and never from the transparent parts",
        path: `${EXAMPLES_ROOT}/Image.vue`,
    },
    {
        key: "stressTest",
        name: EXAMPLE_NAMES.stressTest,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="durationMs" v-bind="ParticleDissolveKnobs.DURATION_MS_TEXT">
            <PageNumberField
                :value="durationMs"
                :min="ParticleDissolveKnobs.MIN_DURATION_MS"
                :max="ParticleDissolveKnobs.MAX_DURATION_MS"
                :step="ParticleDissolveKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Duration in milliseconds"
                @input="(value: number) => (durationMs = value)"
            />
        </PageProp>

        <PageProp item-key="particleLifetimeMs" v-bind="ParticleDissolveKnobs.PARTICLE_LIFETIME_MS_TEXT">
            <PageNumberField
                :value="particleLifetimeMs"
                :min="ParticleDissolveKnobs.MIN_LIFETIME_MS"
                :max="ParticleDissolveKnobs.MAX_LIFETIME_MS"
                :step="ParticleDissolveKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Lifetime in milliseconds"
                @input="(value: number) => (particleLifetimeMs = value)"
            />
        </PageProp>

        <PageProp item-key="featherShare" v-bind="ParticleDissolveKnobs.FEATHER_SHARE_TEXT">
            <PageNumberField
                :value="featherShare"
                :min="ParticleDissolveKnobs.MIN_FEATHER"
                :max="ParticleDissolveKnobs.MAX_FEATHER"
                :step="ParticleDissolveKnobs.FEATHER_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Feather"
                @input="(value: number) => (featherShare = value)"
            />
        </PageProp>

        <PageProp item-key="spawnChance" v-bind="ParticleDissolveKnobs.SPAWN_CHANCE_TEXT">
            <PageNumberField
                :value="spawnChance"
                :min="ParticleDissolveKnobs.MIN_SPAWN_CHANCE"
                :max="ParticleDissolveKnobs.MAX_SPAWN_CHANCE"
                :step="ParticleDissolveKnobs.SPAWN_CHANCE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Spawn chance"
                @input="(value: number) => (spawnChance = value)"
            />
        </PageProp>

        <PageProp item-key="cellSize" v-bind="ParticleDissolveKnobs.CELL_SIZE_TEXT">
            <PageNumberField
                :value="cellSize"
                :min="ParticleDissolveKnobs.MIN_CELL_SIZE"
                :max="ParticleDissolveKnobs.MAX_CELL_SIZE"
                :step="ParticleDissolveKnobs.CELL_SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Cell size in pixels"
                @input="(value: number) => (cellSize = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #button>
            <ButtonExample v-bind="commonProps" />
        </template>

        <template #card>
            <CardExampleWrapper v-bind="commonProps" />
        </template>

        <template #svg>
            <SvgExampleWrapper v-bind="commonProps" />
        </template>

        <template #image>
            <ImageExampleWrapper v-bind="commonProps" />
        </template>

        <template #stressTest>
            <StressTestWrapper v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
