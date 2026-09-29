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
import type { FormSectionNestedExampleProps } from "../FormSectionPage.types";

const FIELD_WIDTH = 240;
const CARD_DIGITS = 4;

type Props = FormSectionNestedExampleProps;

const props = defineProps<Props>();

const street = useModel(props, "street");
const card = useModel(props, "card");

const streetMessage = computed(() => (street.value.trim().length > 0 ? "" : "We need somewhere to send it."));

const cardMessage = computed(() =>
    /^\d{4}$/.test(card.value) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`,
);
</script>

<template>
    <Form ariaLabel="Delivery" @submit="props.onSubmit">
        <template #renderContent="state">
            <PageFormStack>
                <FormSection ariaLabel="Delivery">
                    <template #renderCaption>
                        <PageFormSectionCaption>Delivery</PageFormSectionCaption>
                    </template>

                    <template #renderContent>
                        <PageFormSectionBody>
                            <FormField :has-error="streetMessage.length > 0" :message="streetMessage">
                                <template #renderCaption>
                                    <PageFormFieldCaption>Street</PageFormFieldCaption>
                                </template>

                                <template #renderMessage="fieldState">
                                    <PageFormFieldMessage :state="fieldState">{{ streetMessage }}</PageFormFieldMessage>
                                </template>

                                <template #renderControl="fieldState">
                                    <TextInput
                                        v-model:value="street"
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

                            <FormSection ariaLabel="Payment">
                                <template #renderCaption>
                                    <PageFormSectionCaption>Payment</PageFormSectionCaption>
                                </template>

                                <template #renderContent>
                                    <PageFormSectionBody>
                                        <FormField :has-error="cardMessage.length > 0" :message="cardMessage">
                                            <template #renderCaption>
                                                <PageFormFieldCaption>Card ending</PageFormFieldCaption>
                                            </template>

                                            <template #renderMessage="fieldState">
                                                <PageFormFieldMessage :state="fieldState">{{
                                                    cardMessage
                                                }}</PageFormFieldMessage>
                                            </template>

                                            <template #renderControl="fieldState">
                                                <TextInput
                                                    v-model:value="card"
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
                        </PageFormSectionBody>
                    </template>
                </FormSection>

                <PageFormButtons>
                    <Button :is-disabled="!state.isValid" type="submit">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Order</PageButtonContent>
                        </template>
                    </Button>
                </PageFormButtons>
            </PageFormStack>
        </template>
    </Form>
</template>
