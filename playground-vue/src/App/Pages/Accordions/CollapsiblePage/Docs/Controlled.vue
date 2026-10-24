<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Collapsible } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";

const isExpanded = shallowRef(false);
</script>

<template>
    <div :class="styles.docsAccordion">
        <Collapsible v-model:expanded="isExpanded" sizing="fit-content">
            <template #renderTrigger="flags">
                <PageAccordionHeader :flags="flags">{{
                    flags.isExpanded ? "Show less" : "Show more"
                }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                <PageAccordionPanel
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                >
                    <div>Pressing the trigger and the button below both write the same boolean.</div>
                </PageAccordionPanel>
            </template>
        </Collapsible>
    </div>

    <Button @click="() => void (isExpanded = !isExpanded)">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Toggle from here</PageButtonContent>
        </template>
    </Button>
</template>
