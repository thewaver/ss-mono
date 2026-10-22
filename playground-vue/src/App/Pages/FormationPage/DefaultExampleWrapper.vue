<script setup lang="ts">
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DefaultExample from "./Examples/Default.vue";
import type { FormationExampleProps } from "./FormationPageVue.types";

const props = defineProps<FormationExampleProps>();
</script>

<template>
    <PageMeasureBox :width="props.width">
        <DefaultExample v-bind="props" />
    </PageMeasureBox>
</template>
