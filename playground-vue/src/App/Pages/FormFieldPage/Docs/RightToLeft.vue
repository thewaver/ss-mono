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

const MESSAGE = "Shown to everyone who can see your posts";

const value = shallowRef("");
</script>

<template>
    <div dir="rtl">
        <FormField :message="MESSAGE">
            <template #renderCaption>
                <PageFormFieldCaption>Display name</PageFormFieldCaption>
            </template>

            <template #renderMessage="state">
                <PageFormFieldMessage :state="state">{{ MESSAGE }}</PageFormFieldMessage>
            </template>

            <template #renderControl="state">
                <TextInput
                    v-model:value="value"
                    :has-error="state.hasError"
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
    </div>
</template>
