<script setup lang="ts">
import { h, shallowRef } from "vue";

import { SegmentedInput } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, TextFieldFlags } from "@thewaver/ss-components-vue";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { SegmentedInputTooltipDocsExampleProps } from "../SegmentedInputPageVue.types";

type Props = SegmentedInputTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef("");

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but nothing typed may reach the cells.",
        ),
};
</script>

<template>
    <SegmentedInput
        v-model:value="value"
        :cell-count="ONE_TIME_CODE_LENGTH"
        :gap="FIELD_GAP"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Disabled but reachable code"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderCell="cell">
            <PageSegmentedInputCell :render-props="cell" />
        </template>
    </SegmentedInput>
</template>
