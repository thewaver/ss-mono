<script setup lang="ts">
import { shallowRef } from "vue";

import { CurrencyInput } from "@thewaver/ss-components-vue";
import { STARTING_BUDGET } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { CurrencyInputBoundedDocsExampleProps } from "../CurrencyInputPageVue.types";

const FIELD_WIDTH = 200;

type Props = CurrencyInputBoundedDocsExampleProps;

defineProps<Props>();

const value = shallowRef<number | undefined>(STARTING_BUDGET);
</script>

<template>
    <CurrencyInput
        v-model:value="value"
        :max="max"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Budget"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>
    </CurrencyInput>
</template>
