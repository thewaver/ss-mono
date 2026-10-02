<script setup lang="ts">
import { computed } from "vue";

import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import ScrambledExample from "./Examples/Scrambled.vue";
import type { PaintedTextExampleProps, PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

const props = defineProps<PaintedTextExampleWrapperProps>();

const exampleProps = computed((): PaintedTextExampleProps => {
    const { width: _width, ...rest } = props;

    return rest;
});
</script>

<template>
    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <ScrambledExample v-bind="exampleProps" />
    </PageMeasureBox>
</template>
