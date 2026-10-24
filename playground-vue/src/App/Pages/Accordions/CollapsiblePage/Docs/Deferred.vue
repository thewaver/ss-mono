<script setup lang="ts">
import { shallowRef } from "vue";

import { Collapsible } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as collapsibleStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import DeferredPanel from "./DeferredPanel.vue";

const isBuilt = shallowRef(false);
</script>

<template>
    <div :class="collapsibleStyles.docsAccordion">
        <Collapsible sizing="fill" is-panel-built-on-expand>
            <template #renderTrigger="flags">
                <PageAccordionHeader :flags="flags">{{
                    flags.isExpanded ? "Hide the delivery notes" : "Show the delivery notes"
                }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                <DeferredPanel
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    @build="isBuilt = true"
                />
            </template>
        </Collapsible>
    </div>

    <div :class="styles.exampleReadout">{{ `Panel built: ${isBuilt ? "yes" : "not yet"}` }}</div>
</template>
