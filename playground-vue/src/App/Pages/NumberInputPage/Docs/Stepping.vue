<script setup lang="ts">
import { shallowRef } from "vue";

import { NumberInput } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { NumberInputSteppingDocsExampleProps } from "../NumberInputPageVue.types";

type Props = NumberInputSteppingDocsExampleProps;

defineProps<Props>();

const value = shallowRef<number | undefined>(13);
</script>

<template>
    <NumberInput
        v-model:value="value"
        :min="min"
        :max="max"
        :step="step"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Quantity"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderTrailing="{ flags, stepper }">
            <PageNumberInputStepper :flags="flags" :stepper="stepper" />
        </template>
    </NumberInput>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${value ?? "nothing"}` }}</div>
</template>
