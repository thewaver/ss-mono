<script setup lang="ts">
import { Accordion } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { AccordionBasicDocsExampleProps } from "../AccordionPageVue.types";

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
    Unavailable: ["This section is disabled, so its header refuses to open it."],
};

const ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Unavailable", isDisabled: true },
];

type Props = AccordionBasicDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.docsAccordion">
        <Accordion
            :items="ITEMS"
            :is-single-expand="isSingleExpand"
            :is-expand-required="isExpandRequired"
            :gap="gap"
            :transition-duration-ms="transitionDurationMs"
        >
            <template #renderHeader="{ item, flags }">
                <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ item, visibilityTarget, transitionDurationMs: panelDurationMs }">
                <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="panelDurationMs">
                    <div v-for="line in SECTION_BODIES[item.value]" :key="line">{{ line }}</div>
                </PageAccordionPanel>
            </template>
        </Accordion>
    </div>
</template>
