<script setup lang="ts">
import { shallowRef } from "vue";

import { NumberInput } from "@thewaver/ss-components-vue";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { NumberInputBasicDocsExampleProps } from "../NumberInputPageVue.types";

type Props = NumberInputBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef<number | undefined>(undefined);
</script>

<template>
    <NumberInput
        v-model:value="value"
        :is-disabled="isDisabled"
        :has-error="hasError"
        :is-read-only="isReadOnly"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="How many"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">How many</PageTextFieldPlaceholder>
        </template>

        <template #renderTrailing="{ flags, stepper }">
            <PageNumberInputStepper :flags="flags" :stepper="stepper" />
        </template>
    </NumberInput>
</template>
