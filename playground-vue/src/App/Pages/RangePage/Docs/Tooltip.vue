<script setup lang="ts">
import { h, shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, RangeRenderProps } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { RangeTooltipDocsExampleProps } from "../RangePageVue.types";

type Props = RangeTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef(75);

const tooltipDefs: InteractionTooltipDefs<RangeRenderProps> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () =>
                "Focusable so this tooltip can be read, but arrow keys and dragging must leave the value where it is.",
        ),
};
</script>

<template>
    <Range
        id="tooltipVolume"
        v-model:value="value"
        ariaLabel="Disabled but reachable range"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        :thumb-size="RANGE_THUMB_SIZE"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>
</template>
