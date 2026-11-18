<script setup lang="ts">
import { shallowRef } from "vue";

import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import HueExample from "./Examples/Hue.vue";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const props = defineProps<SVGFiltersExampleProps>();

const deg = shallowRef(SVGFilterKnobs.Hue.STARTING_DEG);
const saturation = shallowRef(SVGFilterKnobs.Hue.STARTING_SATURATION);
const red = shallowRef(SVGFilterKnobs.Hue.STARTING_CHANNEL);
const green = shallowRef(SVGFilterKnobs.Hue.STARTING_CHANNEL);
const blue = shallowRef(SVGFilterKnobs.Hue.STARTING_CHANNEL);
</script>

<template>
    <HueExample v-bind="props" :deg="deg" :saturation="saturation" :r="red" :g="green" :b="blue" />

    <PageExampleKnobs>
        <PageProp item-key="deg" v-bind="SVGFilterKnobs.DEG_TEXT">
            <PageNumberField
                :value="deg"
                :min="SVGFilterKnobs.Hue.MIN_DEG"
                :max="SVGFilterKnobs.Hue.MAX_DEG"
                :step="SVGFilterKnobs.Hue.DEG_STEP"
                ariaLabel="Hue rotation"
                @input="(value: number) => (deg = value)"
            />
        </PageProp>

        <PageProp item-key="saturation" v-bind="SVGFilterKnobs.SATURATION_TEXT">
            <PageNumberField
                :value="saturation"
                :min="SVGFilterKnobs.Hue.MIN_AMOUNT"
                :max="SVGFilterKnobs.Hue.MAX_AMOUNT"
                :step="SVGFilterKnobs.Hue.AMOUNT_STEP"
                ariaLabel="Saturation"
                @input="(value: number) => (saturation = value)"
            />
        </PageProp>

        <PageProp item-key="red" v-bind="SVGFilterKnobs.RED_TEXT">
            <PageNumberField
                :value="red"
                :min="SVGFilterKnobs.Hue.MIN_CHANNEL"
                :max="SVGFilterKnobs.Hue.MAX_CHANNEL"
                :step="SVGFilterKnobs.Hue.CHANNEL_STEP"
                ariaLabel="Red"
                @input="(value: number) => (red = value)"
            />
        </PageProp>

        <PageProp item-key="green" v-bind="SVGFilterKnobs.GREEN_TEXT">
            <PageNumberField
                :value="green"
                :min="SVGFilterKnobs.Hue.MIN_CHANNEL"
                :max="SVGFilterKnobs.Hue.MAX_CHANNEL"
                :step="SVGFilterKnobs.Hue.CHANNEL_STEP"
                ariaLabel="Green"
                @input="(value: number) => (green = value)"
            />
        </PageProp>

        <PageProp item-key="blue" v-bind="SVGFilterKnobs.BLUE_TEXT">
            <PageNumberField
                :value="blue"
                :min="SVGFilterKnobs.Hue.MIN_CHANNEL"
                :max="SVGFilterKnobs.Hue.MAX_CHANNEL"
                :step="SVGFilterKnobs.Hue.CHANNEL_STEP"
                ariaLabel="Blue"
                @input="(value: number) => (blue = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
