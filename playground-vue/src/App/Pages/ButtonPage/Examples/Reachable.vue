<script setup lang="ts">
import { h } from "vue";

import { Button } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ButtonExampleProps } from "../ButtonPage.types";

type Props = ButtonExampleProps;

const props = defineProps<Props>();

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    hoverShowDelayMs: 0,
    renderContent: ({ visibilityTarget, transitionDurationMs, flags }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () =>
                `Focusable so this tooltip can be read, but clicking and pressing Enter must leave the count at zero. The shell reports isDisabled: ${flags.isDisabled}.`,
        ),
};
</script>

<template>
    <Button is-disabled is-reachable-when-disabled :tooltip-defs="tooltipDefs" @click="props.onClick">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Click Me</PageButtonContent>
        </template>
    </Button>
</template>
