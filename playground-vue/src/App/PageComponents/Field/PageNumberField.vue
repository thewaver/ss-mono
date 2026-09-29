<script setup lang="ts">
import { NumberInput, SignalMirrorVueUtils } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageNumberInputStepper from "../NumberInputStepper/NumberInputStepper.vue";
import { useFieldReset } from "./Field.context";
import type { PageNumberFieldProps } from "./Field.types";

const DEFAULT_NUMBER_FIELD_WIDTH = 100;

const props = defineProps<PageNumberFieldProps>();

useFieldReset(props.value, (value) => props.onInput(value));

const value = SignalMirrorVueUtils.useValueMirror<number | undefined>(
    () => props.value,
    (next) => {
        if (next === undefined) return;

        props.onInput(next);
    },
);
</script>

<template>
    <NumberInput
        :id="id"
        v-model:value="value"
        :min="min"
        :max="max"
        :step="step"
        :is-disabled="isDisabled"
        :ariaLabel="ariaLabel"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="width ?? DEFAULT_NUMBER_FIELD_WIDTH" />
        </template>

        <template #renderTrailing="{ flags, stepper }">
            <PageNumberInputStepper :flags="flags" :stepper="stepper" />
        </template>
    </NumberInput>
</template>
