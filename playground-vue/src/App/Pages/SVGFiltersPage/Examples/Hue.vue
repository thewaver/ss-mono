<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersHue";

type Props = SVGFiltersExampleProps;

const props = defineProps<Props>();

const deg = shallowRef(SVGFilterKnobs.Hue.STARTING_DEG);
const saturation = shallowRef(SVGFilterKnobs.Hue.STARTING_SATURATION);
const red = shallowRef(SVGFilterKnobs.Hue.STARTING_CHANNEL);
const green = shallowRef(SVGFilterKnobs.Hue.STARTING_CHANNEL);
const blue = shallowRef(SVGFilterKnobs.Hue.STARTING_CHANNEL);

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID)
        .addHueRotationFilter({ deg: deg.value })
        .addSaturationFilter({ amount: saturation.value })
        .addColorChannelFilter({ r: red.value, g: green.value, b: blue.value })
        .computeFilterPrimitives({
            method: props.method,
            elementSize: props.elementSize,
        }),
);
</script>

<template>
    <PageFilterStage :filter-id="FILTER_ID" label="hue">
        <template #renderDefs>
            <component :is="defs" v-if="defs" />
        </template>
    </PageFilterStage>

    <PageExampleKnobs>
        <PageProp item-key="deg" label="Hue rotation" hint="How far every color is turned round the color wheel.">
            <PageNumberField
                :value="deg"
                :min="SVGFilterKnobs.Hue.MIN_DEG"
                :max="SVGFilterKnobs.Hue.MAX_DEG"
                :step="SVGFilterKnobs.Hue.DEG_STEP"
                ariaLabel="Hue rotation"
                @input="(value: number) => (deg = value)"
            />
        </PageProp>

        <PageProp
            item-key="saturation"
            label="Saturation"
            hint="How colorful the result is. 0 takes it to gray, above 1 pushes the colors harder."
        >
            <PageNumberField
                :value="saturation"
                :min="SVGFilterKnobs.Hue.MIN_AMOUNT"
                :max="SVGFilterKnobs.Hue.MAX_AMOUNT"
                :step="SVGFilterKnobs.Hue.AMOUNT_STEP"
                ariaLabel="Saturation"
                @input="(value: number) => (saturation = value)"
            />
        </PageProp>

        <PageProp
            item-key="red"
            label="Red"
            hint="How much the red channel is scaled on its own, after the hue and saturation have been applied."
        >
            <PageNumberField
                :value="red"
                :min="SVGFilterKnobs.Hue.MIN_CHANNEL"
                :max="SVGFilterKnobs.Hue.MAX_CHANNEL"
                :step="SVGFilterKnobs.Hue.CHANNEL_STEP"
                ariaLabel="Red"
                @input="(value: number) => (red = value)"
            />
        </PageProp>

        <PageProp
            item-key="green"
            label="Green"
            hint="How much the green channel is scaled on its own, after the hue and saturation have been applied."
        >
            <PageNumberField
                :value="green"
                :min="SVGFilterKnobs.Hue.MIN_CHANNEL"
                :max="SVGFilterKnobs.Hue.MAX_CHANNEL"
                :step="SVGFilterKnobs.Hue.CHANNEL_STEP"
                ariaLabel="Green"
                @input="(value: number) => (green = value)"
            />
        </PageProp>

        <PageProp
            item-key="blue"
            label="Blue"
            hint="How much the blue channel is scaled on its own, after the hue and saturation have been applied."
        >
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
