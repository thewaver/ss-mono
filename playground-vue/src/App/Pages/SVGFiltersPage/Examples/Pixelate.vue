<script setup lang="ts">
import { computed } from "vue";

import { SVGFilterDefsFactory } from "@thewaver/ss-components-vue";

import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.vue";
import type { SVGFiltersPixelateExampleProps } from "../SVGFiltersPage.types";

const FILTER_ID = "svgFiltersPixelate";

type Props = SVGFiltersPixelateExampleProps;

const props = defineProps<Props>();

const defs = computed(() =>
    new SVGFilterDefsFactory(FILTER_ID).addPixelateFilter({ size: props.size }).computeFilterPrimitives({
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
</template>
