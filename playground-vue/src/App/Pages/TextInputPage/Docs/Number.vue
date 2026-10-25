<script setup lang="ts">
import { shallowRef } from "vue";

import { TextInput } from "@thewaver/ss-components-vue";
import {
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";

const value = shallowRef("10");
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        type="number"
        ariaLabel="Quantity"
        :min="QUANTITY_MIN"
        :max="QUANTITY_MAX"
        :step="QUANTITY_STEP"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>
    </TextInput>
</template>
