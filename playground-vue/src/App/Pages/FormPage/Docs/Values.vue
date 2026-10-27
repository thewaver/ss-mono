<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Button, DateInput, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-vue";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.vue";
import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.vue";
import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import { PLACEHOLDER } from "../../SelectPage/SelectPageVue.const";
import SelectPopup from "../../SelectPage/SelectPopup.vue";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

const EMPTY_ENTRY = "(empty)";

const describeEntries = (data: FormData) =>
    Array.from(new Set(data.keys()), (key) => `${key}: ${data.getAll(key).join(", ") || EMPTY_ENTRY}`).join("; ");

const plan = shallowRef<string | undefined>();
const topics = shallowRef<string[]>([]);
const start = shallowRef<DateValue | undefined>();
const outcome = shallowRef("Not sent yet.");

const submit = (data: FormData) => {
    outcome.value = `Sent: ${describeEntries(data)}.`;
};

const reset = () => {
    plan.value = undefined;
    topics.value = [];
    start.value = undefined;
    outcome.value = "Not sent yet.";
};
</script>

<template>
    <Form ariaLabel="Booking" @submit="submit" @reset="reset">
        <template #renderContent>
            <PageFormStack>
                <FormField>
                    <template #renderCaption>
                        <PageFormFieldCaption>Plan</PageFormFieldCaption>
                    </template>

                    <template #renderControl>
                        <Select name="plan" v-model:value="plan" :options="PLANS">
                            <template #renderContent="{ selectedOption, flags }">
                                <PageSelectContent :flags="flags">{{
                                    selectedOption?.value ?? PLACEHOLDER
                                }}</PageSelectContent>
                            </template>

                            <template #renderOption="{ option, flags }">
                                <PageSelectOptionContent is-gliding :flags="flags">{{
                                    option.value
                                }}</PageSelectOptionContent>
                            </template>

                            <template #renderHighlightFloater="floater">
                                <PageGlideFloater kind="highlight" v-bind="floater" />
                            </template>

                            <template #renderPopup="popup">
                                <SelectPopup v-bind="popup" />
                            </template>
                        </Select>
                    </template>
                </FormField>

                <FormField>
                    <template #renderCaption>
                        <PageFormFieldCaption>Topics</PageFormFieldCaption>
                    </template>

                    <template #renderControl>
                        <MultiSelect name="topics" v-model:values="topics" :options="TOPICS">
                            <template #renderContent="{ selectedOptions, flags }">
                                <PageSelectContent :flags="flags">{{
                                    selectedOptions.length
                                        ? selectedOptions.map((option) => option.value).join(", ")
                                        : PLACEHOLDER
                                }}</PageSelectContent>
                            </template>

                            <template #renderOption="{ option, flags }">
                                <PageSelectOptionContent is-gliding :flags="flags">{{
                                    option.value
                                }}</PageSelectOptionContent>
                            </template>

                            <template #renderHighlightFloater="floater">
                                <PageGlideFloater kind="highlight" v-bind="floater" />
                            </template>

                            <template #renderPopup="popup">
                                <SelectPopup v-bind="popup" />
                            </template>
                        </MultiSelect>
                    </template>
                </FormField>

                <FormField>
                    <template #renderCaption>
                        <PageFormFieldCaption>Start date</PageFormFieldCaption>
                    </template>

                    <template #renderControl>
                        <DateInput
                            name="start"
                            v-model:value="start"
                            :locale="LOCALE"
                            :part-hints="DATE_PART_HINTS"
                            :padding="FIELD_PADDING"
                            :gap="FIELD_GAP"
                            :compute-text-style="computePageTextFieldTextStyle"
                        >
                            <template #renderContent="flags">
                                <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
                            </template>

                            <template #renderPlaceholder="{ flags, hint }">
                                <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
                            </template>
                        </DateInput>
                    </template>
                </FormField>

                <PageFormButtons>
                    <Button type="submit">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Book</PageButtonContent>
                        </template>
                    </Button>

                    <Button type="reset">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Reset</PageButtonContent>
                        </template>
                    </Button>
                </PageFormButtons>

                <div :class="exampleStyles.exampleReadout" data-readout>{{ outcome }}</div>
            </PageFormStack>
        </template>
    </Form>
</template>
