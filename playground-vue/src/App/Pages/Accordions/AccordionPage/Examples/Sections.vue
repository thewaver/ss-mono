<script setup lang="ts">
import { useModel } from "vue";

import { Accordion } from "@thewaver/ss-components-vue";
import type { AccordionItem } from "@thewaver/ss-components-vue";

import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.vue";
import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.vue";
import type { AccordionExampleProps } from "../../Accordions.types";

const GAP = 5;

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

type Props = AccordionExampleProps & {
    isSingleExpand?: boolean;
    isExpandRequired?: boolean;
};

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <Accordion
        v-model:expanded="expanded"
        :items="ITEMS"
        :is-single-expand="isSingleExpand"
        :is-expand-required="isExpandRequired"
        :gap="GAP"
    >
        <template #renderHeader="{ item, flags }">
            <PageAccordionHeader :flags="flags">{{ item.value }}</PageAccordionHeader>
        </template>

        <template #renderPanel="{ item, visibilityTarget, transitionDurationMs }">
            <PageAccordionPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div v-for="line in SECTION_BODIES[item.value]" :key="line">{{ line }}</div>
            </PageAccordionPanel>
        </template>
    </Accordion>
</template>
