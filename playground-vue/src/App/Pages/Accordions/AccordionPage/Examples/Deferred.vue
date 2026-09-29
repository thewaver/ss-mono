<script setup lang="ts">
import { useModel } from "vue";

import { Accordion } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import type { AccordionDeferredExampleProps } from "../../Accordions.types";
import DeferredPanel from "./DeferredPanel.vue";

const GAP = 5;

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

type Props = AccordionDeferredExampleProps;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <Accordion v-model:expanded="expanded" :items="ITEMS" is-panel-built-on-expand :gap="GAP">
        <template #renderHeader="{ item, flags }">
            <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
        </template>

        <template #renderPanel="{ item, visibilityTarget, transitionDurationMs }">
            <DeferredPanel
                :value="item.value"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                @build="props.onBuild"
            />
        </template>
    </Accordion>
</template>
