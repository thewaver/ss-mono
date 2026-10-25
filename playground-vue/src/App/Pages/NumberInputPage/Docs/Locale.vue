<script setup lang="ts">
import { shallowRef } from "vue";

import { NumberInput } from "@thewaver/ss-components-vue";
import { AMOUNT_STEP, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { NumberInputLocaleDocsExampleProps } from "../NumberInputPageVue.types";

type Props = NumberInputLocaleDocsExampleProps;

defineProps<Props>();

const value = shallowRef<number | undefined>(1234.5);
</script>

<template>
    <NumberInput
        v-model:value="value"
        :locale="locale"
        :step="AMOUNT_STEP"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Amount"
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
