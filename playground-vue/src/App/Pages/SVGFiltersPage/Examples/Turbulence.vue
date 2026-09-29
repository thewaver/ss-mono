<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefs, SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import type { SVGDisplacementChannel } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTurbulence";

type Props = SVGFiltersExampleProps;

const props = defineProps<Props>();

const frequencyX = shallowRef(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
const frequencyY = shallowRef(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
const scale = shallowRef(SVGFilterKnobs.Turbulence.STARTING_SCALE);
const type = shallowRef(SVGFilterKnobs.Turbulence.STARTING_TYPE);
const octaves = shallowRef(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
const seed = shallowRef(SVGFilterKnobs.Turbulence.STARTING_SEED);
const xChannel = shallowRef<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL);
const yChannel = shallowRef<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL);

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID)
        .addTurbulenceFilter({
            baseFrequency: { x: frequencyX.value, y: frequencyY.value },
            scale: scale.value,
            type: type.value,
            numOctaves: octaves.value,
            seed: seed.value,
            xChannelSelector: xChannel.value,
            yChannelSelector: yChannel.value,
        })
        .computeFilterPrimitives({
            method: props.method,
            elementSize: props.elementSize,
        }),
);
</script>

<template>
    <PageFilterStage :filter-id="FILTER_ID" label="bend">
        <template #renderDefs>
            <component :is="defs" v-if="defs" />
        </template>
    </PageFilterStage>

    <PageExampleKnobs>
        <PageProp
            item-key="type"
            label="Type"
            hint="Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined."
        >
            <PageSelectField
                :value="type"
                :values="SVGFilterDefs.TURBULENCE_TYPES"
                ariaLabel="Type"
                @change="(value) => (type = value)"
            />
        </PageProp>

        <PageProp
            item-key="baseFrequencyX"
            label="Base frequency x"
            hint="How fine the noise is across. Higher numbers make a tighter grain."
        >
            <PageNumberField
                :value="frequencyX"
                :min="SVGFilterKnobs.Turbulence.MIN_FREQUENCY"
                :max="SVGFilterKnobs.Turbulence.MAX_FREQUENCY"
                :step="SVGFilterKnobs.Turbulence.FREQUENCY_STEP"
                ariaLabel="Base frequency x"
                @input="(value: number) => (frequencyX = value)"
            />
        </PageProp>

        <PageProp
            item-key="baseFrequencyY"
            label="Base frequency y"
            hint="How fine the noise is down. Set it apart from the across value to stretch the grain."
        >
            <PageNumberField
                :value="frequencyY"
                :min="SVGFilterKnobs.Turbulence.MIN_FREQUENCY"
                :max="SVGFilterKnobs.Turbulence.MAX_FREQUENCY"
                :step="SVGFilterKnobs.Turbulence.FREQUENCY_STEP"
                ariaLabel="Base frequency y"
                @input="(value: number) => (frequencyY = value)"
            />
        </PageProp>

        <PageProp
            item-key="scale"
            label="Scale"
            hint="How far the noise pushes the picture about. 0 leaves the picture where it was."
        >
            <PageNumberField
                :value="scale"
                :min="SVGFilterKnobs.Turbulence.MIN_SCALE"
                :max="SVGFilterKnobs.Turbulence.MAX_SCALE"
                ariaLabel="Scale"
                @input="(value: number) => (scale = value)"
            />
        </PageProp>

        <PageProp
            item-key="numOctaves"
            label="Octaves"
            hint="How many layers of noise are piled up. More layers add fine detail and cost more to draw."
        >
            <PageNumberField
                :value="octaves"
                :min="SVGFilterKnobs.Turbulence.MIN_OCTAVES"
                :max="SVGFilterKnobs.Turbulence.MAX_OCTAVES"
                ariaLabel="Octaves"
                @input="(value: number) => (octaves = value)"
            />
        </PageProp>

        <PageProp
            item-key="seed"
            label="Seed"
            hint="The number the random noise is grown from. Change it for a different pattern at the same settings."
        >
            <PageNumberField
                :value="seed"
                :min="SVGFilterKnobs.Turbulence.MIN_SEED"
                :max="SVGFilterKnobs.Turbulence.MAX_SEED"
                ariaLabel="Seed"
                @input="(value: number) => (seed = value)"
            />
        </PageProp>

        <PageProp
            item-key="xChannelSelector"
            label="X channel"
            hint="Which channel of the noise decides how far each point moves sideways."
        >
            <PageSelectField
                :value="xChannel"
                :values="SVGFilterDefs.DISPLACEMENT_CHANNELS"
                ariaLabel="X channel"
                @change="(value) => (xChannel = value)"
            />
        </PageProp>

        <PageProp
            item-key="yChannelSelector"
            label="Y channel"
            hint="Which channel of the noise decides how far each point moves up or down."
        >
            <PageSelectField
                :value="yChannel"
                :values="SVGFilterDefs.DISPLACEMENT_CHANNELS"
                ariaLabel="Y channel"
                @change="(value) => (yChannel = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
