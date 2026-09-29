<script setup lang="ts">
import { useModel } from "vue";

import { Accordion, Button } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { AccordionGrowingExampleProps } from "../../Accordions.types";

const TRANSITION_DURATION_MS = 400;

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

type Props = AccordionGrowingExampleProps;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <Accordion v-model:expanded="expanded" :items="ITEMS" :transition-duration-ms="TRANSITION_DURATION_MS">
        <template #renderHeader="{ item, flags }">
            <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
        </template>

        <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
            <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <Button id="addALine" @click="props.onAddLine">
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">Add a line</PageButtonContent>
                    </template>
                </Button>

                <div v-for="index in extraLines" :key="index">
                    {{ `Line ${index} appeared after the panel was already open.` }}
                </div>
            </PageAccordionPanel>
        </template>
    </Accordion>
</template>
