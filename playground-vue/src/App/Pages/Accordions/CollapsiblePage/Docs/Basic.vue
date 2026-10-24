<script setup lang="ts">
import { Collapsible } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { CollapsibleBasicDocsExampleProps } from "../CollapsiblePageVue.types";

type Props = CollapsibleBasicDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="[styles.textWithPanel, styles.docsAccordion]">
        <div>
            Orders leave the warehouse within two working days, and tracking arrives by email as soon as the parcel is
            scanned.
        </div>

        <Collapsible :transition-duration-ms="transitionDurationMs" sizing="fit-content">
            <template #renderTrigger="flags">
                <PageAccordionHeader :flags="flags">{{
                    flags.isExpanded ? "Show less" : "Show more"
                }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ visibilityTarget, transitionDurationMs: panelDurationMs }">
                <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="panelDurationMs">
                    <div>
                        Deliveries to the islands take a further two days, and a signature is required for anything
                        above fifty pounds.
                    </div>
                </PageAccordionPanel>
            </template>
        </Collapsible>
    </div>
</template>
