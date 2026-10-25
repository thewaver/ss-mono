<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";
import type { BinarySwitchFlags, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ToggleTooltipDocsExampleProps } from "../TogglePageVue.types";

type Props = ToggleTooltipDocsExampleProps;

defineProps<Props>();

const checked = shallowRef(true);

const tooltipDefs: InteractionTooltipDefs<BinarySwitchFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a toggle."),
};
</script>

<template>
    <Toggle
        v-model:checked="checked"
        ariaLabel="Toggle with a tooltip"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageToggleContent :flags="flags">Toggle with a tooltip</PageToggleContent>
        </template>
    </Toggle>
</template>
