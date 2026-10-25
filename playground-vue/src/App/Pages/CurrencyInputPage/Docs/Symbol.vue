<script setup lang="ts">
import { shallowRef } from "vue";

import { CurrencyInput } from "@thewaver/ss-components-vue";
import { STARTING_PRICE } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const FIELD_WIDTH = 200;

const value = shallowRef<number | undefined>(STARTING_PRICE);
</script>

<template>
    <CurrencyInput
        v-model:value="value"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Price"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>

        <template #renderLeading="flags">
            <PageTextFieldAdornment :flags="flags">£</PageTextFieldAdornment>
        </template>
    </CurrencyInput>
</template>
