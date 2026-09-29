<script setup lang="ts">
import { h, useModel } from "vue";

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
import type { NumberInputExampleProps } from "../NumberInputPage.types";

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but neither the arrows nor the stepper may move the value.",
        ),
};

type Props = NumberInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <NumberInput
        v-model:value="value"
        is-disabled
        is-reachable-when-disabled
        ariaLabel="Disabled but reachable amount"
        :tooltip-defs="tooltipDefs"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderTrailing="{ flags, stepper }">
            <PageNumberInputStepper :flags="flags" :stepper="stepper" />
        </template>
    </NumberInput>
</template>
