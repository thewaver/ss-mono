<script setup lang="ts">
import { h, shallowRef } from "vue";

import { TextInput } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, TextFieldFlags } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { TextInputTooltipDocsExampleProps } from "../TextInputPageVue.types";

type Props = TextInputTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef("Hover or focus me");

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a text field."),
};
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Field with a tooltip"
        :compute-text-style="computePageTextFieldTextStyle"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>
    </TextInput>
</template>
