<script setup lang="ts">
import { onMounted } from "vue";

import { DELIVERY_NOTES } from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { CollapsibleDeferredPanelProps } from "../CollapsiblePageVue.types";

type Props = CollapsibleDeferredPanelProps;

const props = defineProps<Props>();

onMounted(() => props.onBuild());
</script>

<template>
    <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
        <div>{{ DELIVERY_NOTES.join(" · ") }}</div>
    </PageAccordionPanel>
</template>
