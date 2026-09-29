<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Button, Corners, type InteractionActivation } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageRipple from "../../../StyledComponents/Ripple/Ripple.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ButtonPressedExampleProps } from "../ButtonPage.types";

type Props = ButtonPressedExampleProps;

const props = defineProps<Props>();

const activation = shallowRef<InteractionActivation>();

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    hoverShowDelayMs: 0,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "Click me to toggle me."),
};
</script>

<template>
    <Button
        :is-pressed="isPressed"
        :tooltip-defs="tooltipDefs"
        @activation="(next: InteractionActivation) => (activation = next)"
        @click="props.onClick"
    >
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Toggle Me</PageButtonContent>
        </template>

        <template #renderDecoration="flags">
            <Corners :color="flags.isPressed ? 'yellow' : 'transparent'" />
            <PageRipple :activation="activation" color="yellow" />
        </template>
    </Button>
</template>
