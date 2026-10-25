<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Button, Form, FormField, TextInput } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.vue";
import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { FormFieldInFormDocsExampleProps } from "../FormFieldPageVue.types";

const HINT = "Shown to everyone who can see your posts.";
const ERROR = "That name is already taken.";

type Props = FormFieldInFormDocsExampleProps;

const props = defineProps<Props>();

const value = shallowRef("");
const outcome = shallowRef("Not saved yet.");

const message = computed(() => (props.hasError ? ERROR : HINT));

const submit = () => {
    if (props.hasError) return;

    outcome.value = `Saved as ${value.value || "nothing"}.`;
};
</script>

<template>
    <Form ariaLabel="Profile" @submit="submit">
        <template #renderContent="state">
            <PageFormStack>
                <FormField :has-error="hasError" :message="message">
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
                                <PageTextFieldContent :flags="flags" />
                            </template>
                        </TextInput>
                    </template>
                </FormField>

                <PageFormButtons>
                    <Button type="submit">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Save</PageButtonContent>
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
