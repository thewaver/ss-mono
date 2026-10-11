<script setup lang="ts">
import { shallowRef } from "vue";

import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BlurExample from "./Examples/Blur.vue";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const props = defineProps<SVGFiltersExampleProps>();

const stdDeviation = shallowRef(SVGFilterKnobs.Blur.STARTING_DEVIATION);
</script>

<template>
    <BlurExample v-bind="props" :std-deviation="stdDeviation" />

    <PageExampleKnobs>
        <PageProp
            item-key="stdDeviation"
            label="Std deviation"
            hint="How far the blur reaches. 0 leaves the picture sharp."
        >
            <PageNumberField
                :value="stdDeviation"
                :min="SVGFilterKnobs.Blur.MIN_DEVIATION"
                :max="SVGFilterKnobs.Blur.MAX_DEVIATION"
                :step="SVGFilterKnobs.Blur.DEVIATION_STEP"
                ariaLabel="Standard deviation"
                @input="(value: number) => (stdDeviation = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
