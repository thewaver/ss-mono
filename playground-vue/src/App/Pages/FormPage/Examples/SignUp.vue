<script setup lang="ts">
import { computed, useModel } from "vue";

import { Button, Checkbox, Form, FormField, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";
import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.vue";
import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { FormExampleProps } from "../FormPage.types";

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;

type Props = FormExampleProps;

const props = defineProps<Props>();

const email = useModel(props, "email");
const password = useModel(props, "password");
const terms = useModel(props, "terms");

const emailMessage = computed(() => {
    if (email.value.length < 1) return "We only use it to sign you in.";

    return email.value.includes("@") ? "" : "That does not look like an email address.";
});

const passwordMessage = computed(() =>
    password.value.length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`,
);
</script>

<template>
    <Form ariaLabel="Sign up" @submit="props.onSubmit" @reset="props.onReset">
        <template #renderContent="state">
            <PageFormStack>
                <FormField :has-error="emailMessage.includes('not look')" :message="emailMessage">
                    <template #renderCaption>
                        <PageFormFieldCaption>Email</PageFormFieldCaption>
                    </template>

                    <template #renderMessage="fieldState">
                        <PageFormFieldMessage :state="fieldState">{{ emailMessage }}</PageFormFieldMessage>
                    </template>

                    <template #renderControl="fieldState">
                        <TextInput
                            v-model:value="email"
                            :has-error="fieldState.hasError"
                            :padding="FIELD_PADDING"
                            :gap="FIELD_GAP"
                            :compute-text-style="computePageTextFieldTextStyle"
                        >
                            <template #renderContent="flags">
                                <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
                            </template>
                        </TextInput>
                    </template>
                </FormField>

                <FormField :has-error="passwordMessage.length > 0" :message="passwordMessage">
                    <template #renderCaption>
                        <PageFormFieldCaption>Password</PageFormFieldCaption>
                    </template>

                    <template #renderMessage="fieldState">
                        <PageFormFieldMessage :state="fieldState">{{ passwordMessage }}</PageFormFieldMessage>
                    </template>

                    <template #renderControl="fieldState">
                        <TextInput
                            v-model:value="password"
                            :has-error="fieldState.hasError"
                            :padding="FIELD_PADDING"
                            :gap="FIELD_GAP"
                            :compute-text-style="computePageTextFieldTextStyle"
                        >
                            <template #renderContent="flags">
                                <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
                            </template>
                        </TextInput>
                    </template>
                </FormField>

                <FormField orientation="horizontal" :has-error="!terms" :message="terms ? '' : 'Required.'">
                    <template #renderCaption>
                        <PageFormFieldCaption>Accept the terms</PageFormFieldCaption>
                    </template>

                    <template #renderMessage="fieldState">
                        <PageFormFieldMessage :state="fieldState">Required.</PageFormFieldMessage>
                    </template>

                    <template #renderControl="fieldState">
                        <Checkbox v-model:checked="terms" :has-error="fieldState.hasError">
                            <template #renderContent="flags">
                                <PageCheckboxContent :flags="flags" />
                            </template>
                        </Checkbox>
                    </template>
                </FormField>

                <PageFormButtons>
                    <Button :is-disabled="!state.isValid" type="submit">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Sign up</PageButtonContent>
                        </template>
                    </Button>

                    <Button type="reset">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Reset</PageButtonContent>
                        </template>
                    </Button>
                </PageFormButtons>
            </PageFormStack>
        </template>
    </Form>
</template>
