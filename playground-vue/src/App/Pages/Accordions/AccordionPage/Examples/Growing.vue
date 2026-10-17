<script setup lang="ts">
import { useModel } from "vue";

import { Accordion, Button } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { AccordionGrowingExampleProps } from "../../Accordions.types";

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

type Props = AccordionGrowingExampleProps;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <Accordion v-model:expanded="expanded" :items="ITEMS" :gap="gap" :transition-duration-ms="transitionDurationMs">
        <template #renderHeader="{ item, flags }">
            <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
        </template>

        <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
            <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :class="styles.growingButtons">
                    <Button id="addALine" @click="props.onAddLine">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Add a line</PageButtonContent>
                        </template>
                    </Button>

                    <Button id="clearLines" @click="props.onClearLines">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Clear lines</PageButtonContent>
                        </template>
                    </Button>
                </div>

                <div v-for="index in extraLines" :key="index">
                    {{ `Line ${index} appeared after the panel was already open.` }}
                </div>
            </PageAccordionPanel>
        </template>
    </Accordion>
</template>
