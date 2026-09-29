<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersBlur";

type Props = SVGFiltersExampleProps;

const props = defineProps<Props>();

const stdDeviation = shallowRef(SVGFilterKnobs.Blur.STARTING_DEVIATION);

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID)
        .addGaussianBlurFilter({ stdDeviation: stdDeviation.value })
        .computeFilterPrimitives({
            method: props.method,
            elementSize: props.elementSize,
        }),
);
</script>

<template>
    <PageFilterStage :filter-id="FILTER_ID" label="blur">
        <template #renderDefs>
            <component :is="defs" v-if="defs" />
        </template>
    </PageFilterStage>

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
