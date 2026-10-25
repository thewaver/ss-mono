<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";
import type { BinarySwitchFlags, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { CheckboxTooltipDocsExampleProps } from "../CheckboxPageVue.types";

type Props = CheckboxTooltipDocsExampleProps;

defineProps<Props>();

const checked = shallowRef(true);

const tooltipDefs: InteractionTooltipDefs<BinarySwitchFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    hoverShowDelayMs: 0,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a checkbox."),
};
</script>

<template>
    <Checkbox
        v-model:checked="checked"
        ariaLabel="Checkbox with a tooltip"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageCheckboxContent :flags="flags">Checkbox with a tooltip</PageCheckboxContent>
        </template>
    </Checkbox>
</template>
