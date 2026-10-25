<script setup lang="ts">
import { h, shallowRef } from "vue";

import { NumberInput } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, TextFieldFlags } from "@thewaver/ss-components-vue";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { NumberInputTooltipDocsExampleProps } from "../NumberInputPageVue.types";

type Props = NumberInputTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef<number | undefined>(7);

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but neither the arrows nor the stepper may move the value.",
        ),
};
</script>

<template>
    <NumberInput
        v-model:value="value"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Disabled but reachable amount"
        :compute-text-style="computePageTextFieldTextStyle"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderTrailing="{ flags, stepper }">
            <PageNumberInputStepper :flags="flags" :stepper="stepper" />
        </template>
    </NumberInput>
</template>
