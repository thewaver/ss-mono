<script setup lang="ts">
import { computed, useModel } from "vue";

import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.vue";
import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageFormSectionBody from "../../../StyledComponents/FormFieldContent/PageFormSectionBody.vue";
import PageFormSectionCaption from "../../../StyledComponents/FormFieldContent/PageFormSectionCaption.vue";
import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { FormSectionsExampleProps } from "../FormSectionPage.types";

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;
const MISMATCH_MESSAGE = "The two passwords do not match.";

type Props = FormSectionsExampleProps;

const props = defineProps<Props>();

const email = useModel(props, "email");
const password = useModel(props, "password");
const confirm = useModel(props, "confirm");

const emailMessage = computed(() => (email.value.includes("@") ? "" : "That does not look like an email address."));

const passwordMessage = computed(() =>
    password.value.length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`,
);

const hasMismatch = computed(() => confirm.value !== password.value);
</script>

<template>
    <Form ariaLabel="Create an account" @submit="props.onSubmit" @reset="props.onReset">
        <template #renderContent="state">
            <PageFormStack>
                <FormSection>
                    <template #renderCaption>
                        <PageFormSectionCaption>Who you are</PageFormSectionCaption>
                    </template>

                    <template #renderContent>
                        <PageFormSectionBody>
                            <FormField :has-error="emailMessage.length > 0" :message="emailMessage">
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
                        </PageFormSectionBody>
                    </template>
                </FormSection>

                <FormSection :has-error="hasMismatch" :message="hasMismatch ? MISMATCH_MESSAGE : ''">
                    <template #renderCaption>
                        <PageFormSectionCaption>Pick a password</PageFormSectionCaption>
                    </template>

                    <template #renderMessage="sectionState">
                        <PageFormFieldMessage :state="sectionState">{{ MISMATCH_MESSAGE }}</PageFormFieldMessage>
                    </template>

                    <template #renderContent>
                        <PageFormSectionBody>
                            <FormField :has-error="passwordMessage.length > 0" :message="passwordMessage">
                                <template #renderCaption>
                                    <PageFormFieldCaption>Password</PageFormFieldCaption>
                                </template>

                                <template #renderMessage="fieldState">
                                    <PageFormFieldMessage :state="fieldState">{{
                                        passwordMessage
                                    }}</PageFormFieldMessage>
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

                            <FormField>
                                <template #renderCaption>
                                    <PageFormFieldCaption>Repeat it</PageFormFieldCaption>
                                </template>

                                <template #renderControl>
                                    <TextInput
                                        v-model:value="confirm"
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
                        </PageFormSectionBody>
                    </template>
                </FormSection>

                <PageFormButtons>
                    <Button id="sectionsSubmit" :is-disabled="!state.isValid" type="submit">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Create</PageButtonContent>
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
