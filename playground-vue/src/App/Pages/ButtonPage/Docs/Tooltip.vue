<script setup lang="ts">
import { h } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ButtonTooltipDocsExampleProps } from "../ButtonPageVue.types";

type Props = ButtonTooltipDocsExampleProps;

defineProps<Props>();

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a button."),
};
</script>

<template>
    <Button :is-disabled="isDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" :tooltip-defs="tooltipDefs">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Hover Me</PageButtonContent>
        </template>
    </Button>
</template>
