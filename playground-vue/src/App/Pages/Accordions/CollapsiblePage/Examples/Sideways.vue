<script setup lang="ts">
import { useModel } from "vue";

import { Collapsible } from "@thewaver/ss-components-vue";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { AccordionSinglePanelExampleProps } from "../../Accordions.types";

type Props = AccordionSinglePanelExampleProps;

const PANEL_WIDTH = 220;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <Collapsible v-model:expanded="expanded" sizing="fit-content" side="right">
        <template #renderTrigger="flags">
            <PageAccordionHeader :flags="flags">{{ flags.isExpanded ? "Less" : "More" }}</PageAccordionHeader>
        </template>

        <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
            <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :style="{ width: `${PANEL_WIDTH}px` }">
                    Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                </div>
            </PageAccordionPanel>
        </template>
    </Collapsible>
</template>
