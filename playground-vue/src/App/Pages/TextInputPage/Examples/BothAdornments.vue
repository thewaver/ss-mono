<script setup lang="ts">
import { useModel } from "vue";

import { Button, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const clear = () => {
    value.value = "";
};
</script>

<template>
    <TextInput
        v-model:value="value"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        ariaLabel="Amount"
        input-mode="decimal"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" />
        </template>

        <template #renderPlaceholder="{ flags }">
            <PageTextFieldPlaceholder :flags="flags">0.00</PageTextFieldPlaceholder>
        </template>

        <template #renderLeading="flags">
            <PageTextFieldAdornment :flags="flags">USD</PageTextFieldAdornment>
        </template>

        <template #renderTrailing>
            <Button :is-disabled="value === ''" @click="clear">
                <template #renderContent="flags">
                    <PageTextFieldAdornment :flags="flags">Clear</PageTextFieldAdornment>
                </template>
            </Button>
        </template>
    </TextInput>
</template>
