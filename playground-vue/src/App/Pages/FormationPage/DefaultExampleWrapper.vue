<script setup lang="ts">
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DefaultExample from "./Examples/Default.vue";
import type { FormationExampleProps } from "./FormationPage.types";

const FORMATION_WIDTH = 380;

const props = defineProps<FormationExampleProps>();
</script>

<template>
    <PageMeasureBox :width="FORMATION_WIDTH">
        <DefaultExample v-bind="props" />
    </PageMeasureBox>
</template>
