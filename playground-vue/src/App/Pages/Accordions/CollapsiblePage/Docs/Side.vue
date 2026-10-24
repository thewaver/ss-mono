<script setup lang="ts">
import { Collapsible } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { CollapsibleSideDocsExampleProps } from "../CollapsiblePageVue.types";

const PANEL_WIDTH = 220;

type Props = CollapsibleSideDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.sideExample">
        <Collapsible :side="side" sizing="fit-content">
            <template #renderTrigger="flags">
                <PageAccordionHeader :flags="flags" :side="side">{{
                    flags.isExpanded ? "Less" : "More"
                }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                <PageAccordionPanel
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                >
                    <div :style="{ width: `${PANEL_WIDTH}px` }">
                        Opens beside its trigger rather than below it, uncovering contents that keep their own width.
                    </div>
                </PageAccordionPanel>
            </template>
        </Collapsible>
    </div>
</template>
