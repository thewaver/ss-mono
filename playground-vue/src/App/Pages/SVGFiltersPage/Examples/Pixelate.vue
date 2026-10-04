<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";
import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersPixelate";

type Props = SVGFiltersExampleProps;

const props = defineProps<Props>();

const size = shallowRef(SVGFilterKnobs.Pixelate.STARTING_SIZE);

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID).addPixelateFilter({ size: size.value }).computeFilterPrimitives({
        method: props.method,
        elementSize: props.elementSize,
    }),
);
</script>

<template>
    <PageFilterStage :filter-id="FILTER_ID" label="pixelate">
        <template #renderDefs>
            <component :is="defs" v-if="defs" />
        </template>
    </PageFilterStage>

    <PageExampleKnobs>
        <PageProp
            item-key="pixelSize"
            label="Square size (px)"
            hint="How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."
        >
            <PageNumberField
                :value="size"
                :min="SVGFilterKnobs.Pixelate.MIN_SIZE"
                :max="SVGFilterKnobs.Pixelate.MAX_SIZE"
                :step="SVGFilterKnobs.Pixelate.SIZE_STEP"
                ariaLabel="Square size in pixels"
                @input="(value: number) => (size = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
