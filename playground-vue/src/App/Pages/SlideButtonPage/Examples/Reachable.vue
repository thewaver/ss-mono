<script setup lang="ts">
import { h } from "vue";

import { SlideButton } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, SlideButtonRenderProps } from "@thewaver/ss-components-vue";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

type Props = SlideButtonExampleProps;

const props = defineProps<Props>();

const tooltipDefs: InteractionTooltipDefs<SlideButtonRenderProps> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () =>
                "Focusable so this tooltip can be read, but neither a drag nor a held Enter may leave the count above zero.",
        ),
};
</script>

<template>
    <SlideButton
        is-disabled
        is-reachable-when-disabled
        :thumb-size="SLIDE_BUTTON_THUMB_SIZE"
        :tooltip-defs="tooltipDefs"
        @activate="props.onActivate"
    >
        <template #renderContent="renderProps">
            <PageSlideButtonContent :render-props="renderProps">Slide or hold to send</PageSlideButtonContent>
        </template>
    </SlideButton>
</template>
