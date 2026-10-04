<script setup lang="ts">
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import ComplexExample from "./Examples/Complex.vue";
import type { TypewriterExampleWrapperProps } from "./TypewriterPage.types";

defineProps<TypewriterExampleWrapperProps>();
</script>

<template>
    <PageMeasureBox :width="width" :padding="MEASURE_BOX_PADDING">
        <ComplexExample
            :compute-animation-name="computeAnimationName"
            :compute-character-weights="computeCharacterWeights"
        />
    </PageMeasureBox>
</template>
