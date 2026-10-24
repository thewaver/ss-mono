<script setup lang="ts">
import { onMounted } from "vue";

import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { CollapsibleDeferredPanelProps } from "../CollapsiblePageVue.types";

const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

type Props = CollapsibleDeferredPanelProps;

const props = defineProps<Props>();

onMounted(() => props.onBuild());
</script>

<template>
    <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
        <div>{{ NOTES.join(" · ") }}</div>
    </PageAccordionPanel>
</template>
