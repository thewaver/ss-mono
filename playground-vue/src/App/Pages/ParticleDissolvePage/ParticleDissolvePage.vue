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
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="durationMs"
            controls="Sets ParticleDissolveProps.durationMs"
            label="Duration (ms)"
            hint="How long the whole dissolve takes, from the first of the content going to the last particle gone."
        >
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

        <PageProp
            item-key="particleLifetimeMs"
            controls="Sets ParticleDissolveProps.particleLifetimeMs"
            label="Lifetime (ms)"
            hint="How long one particle lives. It is held below the duration, so a longer lifetime leaves less time for the edge to travel."
        >
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

        <PageProp
            item-key="featherShare"
            controls="Sets ParticleDissolveProps.featherShare"
            label="Feather (0-1)"
            hint="How gradually the edge fades the content, as a share of the distance the sweep travels. 0 gives a hard edge."
        >
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

        <PageProp
            item-key="spawnChance"
            controls="Sets ParticleDissolveProps.spawnChance"
            label="Spawn chance (0-1)"
            hint="The chance each particle is released. Lower thins the ash out."
        >
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

        <PageProp
            item-key="cellSize"
            controls="Sets ParticleDissolveProps.cellSize"
            label="Cell size (px)"
            hint="The side of one square of the grid particles are released from. Smaller squares mean finer ash and more of them."
        >
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
    </PageExamples>
</template>
