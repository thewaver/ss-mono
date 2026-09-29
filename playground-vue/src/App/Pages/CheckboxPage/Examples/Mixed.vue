<script setup lang="ts">
import { h, useModel } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";
import type { BinarySwitchFlags, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.vue";
import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { CheckboxMixedExampleProps } from "../CheckboxPage.types";

type Props = CheckboxMixedExampleProps;

const props = defineProps<Props>();

const all = useModel(props, "all");
const firstChild = useModel(props, "firstChild");
const secondChild = useModel(props, "secondChild");

const setChildren = (isChecked: boolean) => {
    firstChild.value = isChecked;
    secondChild.value = isChecked;
};

const tooltipDefs: InteractionTooltipDefs<BinarySwitchFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs, flags }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () =>
                `Summarizes the two boxes on the right. It reads mixed whenever they disagree, and clicking it sets both. checkedState: ${String(flags.checkedState)}.`,
        ),
};
</script>

<template>
    <PageControlRow>
        <Checkbox
            id="selectAll"
            v-model:checked="all"
            :is-mixed="isMixed"
            ariaLabel="Select all"
            :tooltip-defs="tooltipDefs"
            @change="setChildren"
        >
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>

        <PageControlRowLabel>controls</PageControlRowLabel>

        <Checkbox id="firstChild" v-model:checked="firstChild" ariaLabel="First child">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>

        <Checkbox v-model:checked="secondChild" ariaLabel="Second child">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags" />
            </template>
        </Checkbox>
    </PageControlRow>
</template>
