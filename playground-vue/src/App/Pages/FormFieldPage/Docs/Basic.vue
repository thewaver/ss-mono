<script setup lang="ts">
import { shallowRef } from "vue";

import { FormField, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { FormFieldBasicDocsExampleProps } from "../FormFieldPageVue.types";

type Props = FormFieldBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef("");
</script>

<template>
    <FormField :orientation="orientation" :gap="gap" :has-error="hasError" :is-required="isRequired" :message="message">
        <template #renderCaption="state">
            <PageFormFieldCaption>Display name{{ state.isRequired ? " *" : "" }}</PageFormFieldCaption>
        </template>

        <template #renderMessage="state">
            <PageFormFieldMessage :state="state">{{ message }}</PageFormFieldMessage>
        </template>

        <template #renderControl="state">
            <TextInput
                v-model:value="value"
                :has-error="state.hasError"
                :is-required="state.isRequired"
                :padding="FIELD_PADDING"
                :gap="FIELD_GAP"
                :compute-text-style="computePageTextFieldTextStyle"
            >
                <template #renderContent="flags">
                    <PageTextFieldContent :flags="flags" />
                </template>
            </TextInput>
        </template>
    </FormField>
</template>
