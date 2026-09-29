<script setup lang="ts">
import { useModel } from "vue";

import { Button, Form, FormField, TextInput } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
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
    <Form ariaLabel="Display name">
        <template #renderContent="state">
            <div :class="styles.formStack">
                <FormField :orientation="orientation" :gap="gap" :has-error="hasError" :message="message">
                    <template #renderCaption>
                        <PageFormFieldCaption>Display name</PageFormFieldCaption>
                    </template>

                    <template #renderMessage="fieldState">
                        <PageFormFieldMessage :state="fieldState">{{ message }}</PageFormFieldMessage>
                    </template>

                    <template #renderControl="fieldState">
                        <TextInput
                            v-model:value="value"
                            :has-error="fieldState.hasError"
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

                <Button :is-disabled="!state.isValid" type="submit">
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">Save</PageButtonContent>
                    </template>
                </Button>
            </div>
        </template>
    </Form>
</template>
