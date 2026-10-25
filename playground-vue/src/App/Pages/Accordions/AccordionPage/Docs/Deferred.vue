<script setup lang="ts">
import { shallowRef } from "vue";

import { Accordion } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as accordionStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import DeferredPanel from "./DeferredPanel.vue";

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

const built = shallowRef<string[]>([]);

const build = (value: string) => {
    if (!built.value.includes(value)) built.value = [...built.value, value];
};
</script>

<template>
    <div :class="accordionStyles.docsAccordion">
        <Accordion :items="ITEMS" :gap="DOCS_GAP" is-panel-built-on-expand>
            <template #renderHeader="{ item, flags }">
                <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ item, visibilityTarget, transitionDurationMs }">
                <DeferredPanel
                    :value="item.value"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    @build="build"
                />
            </template>
        </Accordion>
    </div>

    <div :class="styles.exampleReadout" data-readout>
        {{ `Built so far: ${built.length ? built.join(", ") : "nothing"}` }}
    </div>
</template>
