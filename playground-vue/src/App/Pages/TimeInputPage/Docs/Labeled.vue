<script setup lang="ts">
import { shallowRef } from "vue";

import { Label, TimeInput } from "@thewaver/ss-components-vue";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const LABEL_GAP = 5;

const value = shallowRef<TimeValue | undefined>();
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Wake-up time</PageLabelCaption>

        <TimeInput
            v-model:value="value"
            :segment-hints="TIME_SEGMENT_HINTS"
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
        </TimeInput>
    </Label>
</template>
