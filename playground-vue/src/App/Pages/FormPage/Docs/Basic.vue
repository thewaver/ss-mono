<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, Checkbox, Form, FormField, TextInput } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
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

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;

const email = shallowRef("");
const password = shallowRef("");
const terms = shallowRef(false);
const outcome = shallowRef("Not sent yet.");

const hasEmailError = computed(() => !email.value.includes("@"));

const emailMessage = computed(() => {
    if (email.value.length < 1) return "Enter your email.";

    return hasEmailError.value ? "That does not look like an email address." : "We only use it to sign you in.";
});

const passwordMessage = computed(() =>
    password.value.length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`,
);

const getIsComplete = () => !hasEmailError.value && !passwordMessage.value && terms.value;

const submit = () => {
    if (!getIsComplete()) return;

    outcome.value = `Sent as ${email.value}.`;
};

const reset = () => {
    email.value = "";
    password.value = "";
    terms.value = false;
    outcome.value = "Not sent yet.";
};
</script>

<template>
    <Form ariaLabel="Sign up" @submit="submit" @reset="reset">
        <template #renderContent="state">
            <PageFormStack>
                <FormField :has-error="hasEmailError" :message="emailMessage">
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
                    <Button type="submit">
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

                <div :class="exampleStyles.exampleReadout" data-readout>
                    {{ `${state.isValid ? "Ready to send." : "Some fields need attention."} ${outcome}` }}
                </div>
            </PageFormStack>
        </template>
    </Form>
</template>
