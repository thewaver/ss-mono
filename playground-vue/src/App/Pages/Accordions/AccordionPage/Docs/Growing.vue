<script setup lang="ts">
import { shallowRef } from "vue";

import { Accordion, Button } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";

const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

const expanded = shallowRef<string[]>(["Shipping"]);
const extraLines = shallowRef(0);
</script>

<template>
    <div :class="styles.docsAccordion">
        <Accordion v-model:expanded="expanded" :items="ITEMS" :gap="DOCS_GAP">
            <template #renderHeader="{ item, flags }">
                <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
            </template>

            <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                <PageAccordionPanel
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                >
                    <div :class="styles.growingButtons">
                        <Button id="addALine" @click="() => void extraLines++">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Add a line</PageButtonContent>
                            </template>
                        </Button>

                        <Button id="clearLines" @click="() => void (extraLines = 0)">
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
    </div>
</template>
