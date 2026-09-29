<script setup lang="ts">
import { onMounted } from "vue";

import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

type Props = {
    value: string;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onBuild: (value: string) => void;
};

const props = defineProps<Props>();

onMounted(() => props.onBuild(props.value));
</script>

<template>
    <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
        <div v-for="line in SECTION_BODIES[value]" :key="line" :data-built="value">{{ line }}</div>
    </PageAccordionPanel>
</template>
