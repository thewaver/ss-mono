<script setup lang="ts">
import { shallowRef } from "vue";

import { FormField, FormSection, TextInput } from "@thewaver/ss-components-vue";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormSectionBody from "../../../StyledComponents/FormFieldContent/PageFormSectionBody.vue";
import PageFormSectionCaption from "../../../StyledComponents/FormFieldContent/PageFormSectionCaption.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";

const street = shallowRef("");
const city = shallowRef("");
</script>

<template>
    <div dir="rtl">
        <FormSection>
            <template #renderCaption>
                <PageFormSectionCaption>Delivery</PageFormSectionCaption>
            </template>

            <template #renderContent>
                <PageFormSectionBody>
                    <FormField>
                        <template #renderCaption>
                            <PageFormFieldCaption>Street</PageFormFieldCaption>
                        </template>

                        <template #renderControl>
                            <TextInput
                                v-model:value="street"
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

                    <FormField>
                        <template #renderCaption>
                            <PageFormFieldCaption>City</PageFormFieldCaption>
                        </template>

                        <template #renderControl>
                            <TextInput
                                v-model:value="city"
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
                </PageFormSectionBody>
            </template>
        </FormSection>
    </div>
</template>
