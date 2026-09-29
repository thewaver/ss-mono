<script setup lang="ts">
import { useModel } from "vue";

import { Collapsible } from "@thewaver/ss-components-vue";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

const NOTES = ["Signed for on arrival", "Left with a neighbor", "Returned to the depot"];

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <Collapsible v-model:expanded="expanded" sizing="fill" is-panel-built-on-expand>
        <template #renderTrigger="flags">
            <PageAccordionHeader :flags="flags">{{
                flags.isExpanded ? "Hide the delivery notes" : "Show the delivery notes"
            }}</PageAccordionHeader>
        </template>

        <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
            <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div>{{ NOTES.join(" · ") }}</div>
            </PageAccordionPanel>
        </template>
    </Collapsible>
</template>
