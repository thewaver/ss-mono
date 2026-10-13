<script setup lang="ts">
import { FORMATION_WIDTH } from "@thewaver/ss-playground/App/Pages/FormationPage/FormationPage.const";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import DefaultExample from "./Examples/Default.vue";
import type { FormationExampleProps } from "./FormationPageVue.types";

const props = defineProps<FormationExampleProps>();
</script>

<template>
    <PageMeasureBox :width="FORMATION_WIDTH">
        <DefaultExample v-bind="props" />
    </PageMeasureBox>
</template>
