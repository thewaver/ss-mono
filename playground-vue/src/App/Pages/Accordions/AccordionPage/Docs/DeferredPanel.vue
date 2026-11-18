<script setup lang="ts">
import { onMounted } from "vue";

import { ENABLED_SECTION_BODIES } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { AccordionDeferredPanelProps } from "../AccordionPageVue.types";

type Props = AccordionDeferredPanelProps;

const props = defineProps<Props>();

onMounted(() => props.onBuild(props.value));
</script>

<template>
    <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
        <div v-for="line in ENABLED_SECTION_BODIES[value]" :key="line" :data-built="value">{{ line }}</div>
    </PageAccordionPanel>
</template>
