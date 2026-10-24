<script setup lang="ts">
import { shallowRef } from "vue";

import { Accordion, Button } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageControlRow from "../../../../PageComponents/ControlRow/PageControlRow.vue";
import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";

const SECTION_BODIES: Record<string, string[]> = {
    Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
    Returns: ["Thirty days, unopened, receipt or order number."],
    Warranty: ["Two years against manufacturing defects."],
};

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

const expanded = shallowRef<string[]>(["Shipping"]);
</script>

<template>
    <div :class="styles.docsAccordion">
        <Accordion v-model:expanded="expanded" :items="ITEMS" :gap="DOCS_GAP">
            <template #renderHeader="{ item, flags }">
                <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ item, visibilityTarget, transitionDurationMs }">
                <PageAccordionPanel
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                >
                    <div v-for="line in SECTION_BODIES[item.value]" :key="line">{{ line }}</div>
                </PageAccordionPanel>
            </template>
        </Accordion>
    </div>

    <PageControlRow>
        <Button @click="() => void (expanded = ITEMS.map((item) => item.value))">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Open all</PageButtonContent>
            </template>
        </Button>

        <Button @click="() => void (expanded = [])">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Close all</PageButtonContent>
            </template>
        </Button>
    </PageControlRow>
</template>
