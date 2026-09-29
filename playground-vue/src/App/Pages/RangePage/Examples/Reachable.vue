<script setup lang="ts">
import { h, useModel } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, RangeRenderProps } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { RangeExampleProps } from "../RangePage.types";

type Props = RangeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const tooltipDefs: InteractionTooltipDefs<RangeRenderProps> = {
    placement: { x: "center", y: "top-out" },
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
        v-model:value="value"
        ariaLabel="Disabled but reachable range"
        is-disabled
        is-reachable-when-disabled
        :thumb-size="RANGE_THUMB_SIZE"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>
</template>
