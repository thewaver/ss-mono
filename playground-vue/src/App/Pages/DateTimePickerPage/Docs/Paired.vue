<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateTimeValue } from "@thewaver/ss-components-vue";
import {
    DateInput,
    DateTimeValueUtils,
    DateTimeValueVueUtils,
    DateValueUtils,
    TimeInput,
} from "@thewaver/ss-components-vue";
import {
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE, PAIR_FIELD_WIDTH, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { NOON } from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { TimeUtils } from "@thewaver/ss-utils";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const value = shallowRef<DateTimeValue | undefined>(DateTimeValueUtils.of(TODAY, NOON));

const { date, time } = DateTimeValueVueUtils.useSplit(value);

const getValueText = () =>
    value.value ? `${DateValueUtils.toIso(value.value.date)} at ${TimeUtils.toIso(value.value.time)}` : "nothing";
</script>

<template>
    <div :class="styles.dateTimeRow">
        <DateInput
            v-model:value="date"
            ariaLabel="Date"
            :part-hints="DATE_PART_HINTS"
            :locale="LOCALE"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" :width="PAIR_FIELD_WIDTH" />
            </template>

            <template #renderPlaceholder="{ flags, hint }">
                <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
            </template>
        </DateInput>

        <TimeInput
            v-model:value="time"
            ariaLabel="Time"
            :segment-hints="TIME_SEGMENT_HINTS"
            :padding="FIELD_PADDING"
            :gap="FIELD_GAP"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" :width="PAIR_FIELD_WIDTH" />
            </template>

            <template #renderPlaceholder="{ flags, hint }">
                <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
            </template>
        </TimeInput>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${getValueText()}` }}</div>
</template>
