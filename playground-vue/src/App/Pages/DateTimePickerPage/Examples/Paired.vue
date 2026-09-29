<script setup lang="ts">
import { useModel } from "vue";

import { DateInput, DateTimeValueVueUtils, TimeInput } from "@thewaver/ss-components-vue";
import {
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { DateTimeExampleProps } from "../DateTimePickerPage.types";

type Props = DateTimeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");

const { date, time } = DateTimeValueVueUtils.useSplit(value);
</script>

<template>
    <div :class="styles.dateTimeRow">
        <DateInput
            v-model:value="date"
            ariaLabel="Date"
            :part-hints="DATE_PART_HINTS"
            :locale="LOCALE"
            :padding="FIELD_STEPPER_PADDING"
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

        <TimeInput
            v-model:value="time"
            ariaLabel="Time"
            :segment-hints="TIME_SEGMENT_HINTS"
            :padding="FIELD_STEPPER_PADDING"
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
    </div>
</template>
