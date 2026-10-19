<script setup lang="ts">
import { shallowRef } from "vue";

import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ToneExample from "./Examples/Tone.vue";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const props = defineProps<SVGFiltersExampleProps>();

const brightness = shallowRef(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
const contrast = shallowRef(SVGFilterKnobs.Tone.STARTING_CONTRAST);
const inversion = shallowRef(SVGFilterKnobs.Tone.STARTING_INVERSION);
</script>

<template>
    <ToneExample v-bind="props" :brightness="brightness" :contrast="contrast" :inversion="inversion" />

    <PageExampleKnobs>
        <PageProp
            item-key="brightness"
            controls="Sets SVGBrightnessFilterDefs.amount"
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
            controls="Sets SVGContrastFilterDefs.amount"
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
            controls="Sets SVGInversionFilterDefs.amount"
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
