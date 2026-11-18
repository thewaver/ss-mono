<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefs } from "@thewaver/ss-components-vue";
import type { SVGDisplacementChannel } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import TurbulenceExample from "./Examples/Turbulence.vue";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const props = defineProps<SVGFiltersExampleProps>();

const frequencyX = shallowRef(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
const frequencyY = shallowRef(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
const scale = shallowRef(SVGFilterKnobs.Turbulence.STARTING_SCALE);
const type = shallowRef(SVGFilterKnobs.Turbulence.STARTING_TYPE);
const octaves = shallowRef(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
const seed = shallowRef(SVGFilterKnobs.Turbulence.STARTING_SEED);
const xChannel = shallowRef<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL);
const yChannel = shallowRef<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL);

const baseFrequency = computed(() => ({ x: frequencyX.value, y: frequencyY.value }));
</script>

<template>
    <TurbulenceExample
        v-bind="props"
        :base-frequency="baseFrequency"
        :scale="scale"
        :type="type"
        :num-octaves="octaves"
        :seed="seed"
        :x-channel-selector="xChannel"
        :y-channel-selector="yChannel"
    />

    <PageExampleKnobs>
        <PageProp item-key="type" v-bind="SVGFilterKnobs.TYPE_TEXT">
            <PageSelectField
                :value="type"
                :values="SVGFilterDefs.TURBULENCE_TYPES"
                ariaLabel="Type"
                @change="(value) => (type = value)"
            />
        </PageProp>

        <PageProp item-key="baseFrequencyX" v-bind="SVGFilterKnobs.BASE_FREQUENCY_X_TEXT">
            <PageNumberField
                :value="frequencyX"
                :min="SVGFilterKnobs.Turbulence.MIN_FREQUENCY"
                :max="SVGFilterKnobs.Turbulence.MAX_FREQUENCY"
                :step="SVGFilterKnobs.Turbulence.FREQUENCY_STEP"
                ariaLabel="Base frequency x"
                @input="(value: number) => (frequencyX = value)"
            />
        </PageProp>

        <PageProp item-key="baseFrequencyY" v-bind="SVGFilterKnobs.BASE_FREQUENCY_Y_TEXT">
            <PageNumberField
                :value="frequencyY"
                :min="SVGFilterKnobs.Turbulence.MIN_FREQUENCY"
                :max="SVGFilterKnobs.Turbulence.MAX_FREQUENCY"
                :step="SVGFilterKnobs.Turbulence.FREQUENCY_STEP"
                ariaLabel="Base frequency y"
                @input="(value: number) => (frequencyY = value)"
            />
        </PageProp>

        <PageProp item-key="scale" v-bind="SVGFilterKnobs.SCALE_TEXT">
            <PageNumberField
                :value="scale"
                :min="SVGFilterKnobs.Turbulence.MIN_SCALE"
                :max="SVGFilterKnobs.Turbulence.MAX_SCALE"
                ariaLabel="Scale"
                @input="(value: number) => (scale = value)"
            />
        </PageProp>

        <PageProp item-key="numOctaves" v-bind="SVGFilterKnobs.NUM_OCTAVES_TEXT">
            <PageNumberField
                :value="octaves"
                :min="SVGFilterKnobs.Turbulence.MIN_OCTAVES"
                :max="SVGFilterKnobs.Turbulence.MAX_OCTAVES"
                ariaLabel="Octaves"
                @input="(value: number) => (octaves = value)"
            />
        </PageProp>

        <PageProp item-key="seed" v-bind="SVGFilterKnobs.SEED_TEXT">
            <PageNumberField
                :value="seed"
                :min="SVGFilterKnobs.Turbulence.MIN_SEED"
                :max="SVGFilterKnobs.Turbulence.MAX_SEED"
                ariaLabel="Seed"
                @input="(value: number) => (seed = value)"
            />
        </PageProp>

        <PageProp item-key="xChannelSelector" v-bind="SVGFilterKnobs.X_CHANNEL_SELECTOR_TEXT">
            <PageSelectField
                :value="xChannel"
                :values="SVGFilterDefs.DISPLACEMENT_CHANNELS"
                ariaLabel="X channel"
                @change="(value) => (xChannel = value)"
            />
        </PageProp>

        <PageProp item-key="yChannelSelector" v-bind="SVGFilterKnobs.Y_CHANNEL_SELECTOR_TEXT">
            <PageSelectField
                :value="yChannel"
                :values="SVGFilterDefs.DISPLACEMENT_CHANNELS"
                ariaLabel="Y channel"
                @change="(value) => (yChannel = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
