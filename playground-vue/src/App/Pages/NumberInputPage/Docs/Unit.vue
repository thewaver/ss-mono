<script setup lang="ts">
import { shallowRef } from "vue";

import { NumberInput } from "@thewaver/ss-components-vue";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.css";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.vue";
import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";

const value = shallowRef<number | undefined>(72);
</script>

<template>
    <NumberInput
        v-model:value="value"
        :min="0"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Width"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderTrailing="{ flags, stepper }">
            <div :class="styles.unitTrailing">
                <PageTextFieldAdornment :flags="flags">px</PageTextFieldAdornment>

                <PageNumberInputStepper :flags="flags" :stepper="stepper" />
            </div>
        </template>
    </NumberInput>
</template>
