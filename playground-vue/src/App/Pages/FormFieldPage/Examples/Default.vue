<script setup lang="ts">
import { useModel } from "vue";

import { FormField, TextInput } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { FormFieldExampleProps } from "../FormFieldPage.types";

type Props = FormFieldExampleProps;

const CONTROL_WIDTH = 240;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div :class="styles.fieldBox">
        <FormField :orientation="orientation" :gap="gap" :has-error="hasError" is-required :message="message">
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
                        <PageTextFieldContent :flags="flags" :width="CONTROL_WIDTH" />
                    </template>
                </TextInput>
            </template>
        </FormField>
    </div>
</template>
