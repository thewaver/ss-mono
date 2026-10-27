<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.vue";
import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.vue";
import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.vue";
import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.vue";
import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER } from "../../SelectPage/SelectPageVue.const";
import SelectPopup from "../../SelectPage/SelectPopup.vue";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

const plan = shallowRef<string | undefined>();
const topics = shallowRef<string[]>([]);
const outcome = shallowRef("Not sent yet.");

const getIsComplete = () => plan.value !== undefined && topics.value.length > 0;

const submit = () => {
    if (!getIsComplete()) return;

    outcome.value = `Sent: ${plan.value}, ${topics.value.join(", ")}.`;
};

const reset = () => {
    plan.value = undefined;
    topics.value = [];
    outcome.value = "Not sent yet.";
};

const computePlanMessage = (hasSubmitted: boolean) => (hasSubmitted && plan.value === undefined ? "Pick a plan." : "");

const computeTopicsMessage = (hasSubmitted: boolean) =>
    hasSubmitted && topics.value.length < 1 ? "Pick at least one topic." : "";
</script>

<template>
    <Form ariaLabel="Newsletter" @submit="submit" @reset="reset">
        <template #renderContent="state">
            <PageFormStack>
                <FormField
                    :has-error="computePlanMessage(state.hasSubmitted).length > 0"
                    :message="computePlanMessage(state.hasSubmitted)"
                >
                    <template #renderCaption>
                        <PageFormFieldCaption>Plan</PageFormFieldCaption>
                    </template>

                    <template #renderMessage="fieldState">
                        <PageFormFieldMessage :state="fieldState">{{
                            computePlanMessage(state.hasSubmitted)
                        }}</PageFormFieldMessage>
                    </template>

                    <template #renderControl="fieldState">
                        <Select
                            name="plan"
                            v-model:value="plan"
                            :options="PLANS"
                            is-required
                            :has-error="fieldState.hasError"
                        >
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

                <FormField
                    :has-error="computeTopicsMessage(state.hasSubmitted).length > 0"
                    :message="computeTopicsMessage(state.hasSubmitted)"
                >
                    <template #renderCaption>
                        <PageFormFieldCaption>Topics</PageFormFieldCaption>
                    </template>

                    <template #renderMessage="fieldState">
                        <PageFormFieldMessage :state="fieldState">{{
                            computeTopicsMessage(state.hasSubmitted)
                        }}</PageFormFieldMessage>
                    </template>

                    <template #renderControl="fieldState">
                        <MultiSelect
                            name="topics"
                            v-model:values="topics"
                            :options="TOPICS"
                            is-required
                            :has-error="fieldState.hasError"
                        >
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

                <PageFormButtons>
                    <Button type="submit">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Subscribe</PageButtonContent>
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
