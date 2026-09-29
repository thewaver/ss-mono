<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersTone";

type Props = SVGFiltersExampleProps;

const props = defineProps<Props>();

const brightness = shallowRef(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
const contrast = shallowRef(SVGFilterKnobs.Tone.STARTING_CONTRAST);
const inversion = shallowRef(SVGFilterKnobs.Tone.STARTING_INVERSION);

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID)
        .addBrightnessFilter({ amount: brightness.value })
        .addContrastFilter({ amount: contrast.value })
        .addInversionFilter({ amount: inversion.value })
        .computeFilterPrimitives({
            method: props.method,
            elementSize: props.elementSize,
        }),
);
</script>

<template>
    <PageFilterStage :filter-id="FILTER_ID" label="tone">
        <template #renderDefs>
            <component :is="defs" v-if="defs" />
        </template>
    </PageFilterStage>

    <PageExampleKnobs>
        <PageProp
            item-key="brightness"
            label="Brightness"
            hint="How much lighter or darker the picture is. 1 leaves it alone."
        >
            <PageNumberField
                :value="brightness"
                :min="SVGFilterKnobs.Tone.MIN_AMOUNT"
                :max="SVGFilterKnobs.Tone.MAX_AMOUNT"
                :step="SVGFilterKnobs.Tone.AMOUNT_STEP"
                ariaLabel="Brightness"
                @input="(value: number) => (brightness = value)"
            />
        </PageProp>

        <PageProp
            item-key="contrast"
            label="Contrast"
            hint="How far the lights and darks are pushed apart. 1 leaves it alone."
        >
            <PageNumberField
                :value="contrast"
                :min="SVGFilterKnobs.Tone.MIN_AMOUNT"
                :max="SVGFilterKnobs.Tone.MAX_AMOUNT"
                :step="SVGFilterKnobs.Tone.AMOUNT_STEP"
                ariaLabel="Contrast"
                @input="(value: number) => (contrast = value)"
            />
        </PageProp>

        <PageProp
            item-key="inversion"
            label="Inversion"
            hint="How far the colors are flipped to their opposites. 0 leaves them alone, 1 fully inverts."
        >
            <PageNumberField
                :value="inversion"
                :min="SVGFilterKnobs.Tone.MIN_INVERSION"
                :max="SVGFilterKnobs.Tone.MAX_INVERSION"
                :step="SVGFilterKnobs.Tone.INVERSION_STEP"
                ariaLabel="Inversion"
                @input="(value: number) => (inversion = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
