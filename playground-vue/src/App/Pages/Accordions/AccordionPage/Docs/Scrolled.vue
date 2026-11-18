<script setup lang="ts">
import { Accordion } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import {
    DOCS_GAP,
    SCROLLED_SECTION_BODIES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageAccordionWrapper from "../../../../StyledComponents/AccordionContent/PageAccordionWrapper.vue";
import type { AccordionScrolledDocsExampleProps } from "../AccordionPageVue.types";

const ITEMS: AccordionItem<string>[] = [
    { value: "Shipping" },
    { value: "Returns" },
    { value: "Warranty" },
    { value: "Assembly" },
];

type Props = AccordionScrolledDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="[styles.scrollBox, styles.docsAccordion]" data-scroll-box="">
        <Accordion :items="ITEMS" :gap="DOCS_GAP" :is-scrolled-into-view-on-expand="isScrolledIntoViewOnExpand">
            <template #renderSection="{ renderContent, flags }">
                <PageAccordionWrapper :flags="flags"><component :is="renderContent" /></PageAccordionWrapper>
            </template>

            <template #renderHeader="{ item, flags }">
                <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ item, visibilityTarget, transitionDurationMs }">
                <PageAccordionPanel
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                >
                    <div v-for="line in SCROLLED_SECTION_BODIES[item.value]" :key="line">{{ line }}</div>
                </PageAccordionPanel>
            </template>
        </Accordion>
    </div>
</template>
