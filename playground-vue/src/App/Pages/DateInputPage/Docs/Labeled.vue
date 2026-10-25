<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { DateInput, Label } from "@thewaver/ss-components-vue";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const LABEL_GAP = 5;

const value = shallowRef<DateValue | undefined>();
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Date of birth</PageLabelCaption>

        <DateInput
            v-model:value="value"
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
    </Label>
</template>
