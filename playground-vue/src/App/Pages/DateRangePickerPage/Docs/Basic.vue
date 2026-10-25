<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueRange } from "@thewaver/ss-components-vue";
import { DateRangePicker, DateValueUtils } from "@thewaver/ss-components-vue";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE, PAIR_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { DateRangePickerBasicDocsExampleProps } from "../DateRangePickerPageVue.types";
import PageDateRangeSeparator from "../PageDateRangeSeparator.vue";

type Props = DateRangePickerBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef<DateValueRange | undefined>(undefined);

const getValueText = () =>
    value.value ? `${DateValueUtils.toIso(value.value.start)} to ${DateValueUtils.toIso(value.value.end)}` : "nothing";
</script>

<template>
    <DateRangePicker
        v-model:value="value"
        :is-read-only="isReadOnly"
        :has-error="hasError"
        :is-disabled="isDisabled"
        start-label="Start date"
        end-label="End date"
        calendar-label="Choose a date range"
        :part-hints="DATE_PART_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        trigger-id="basicTrigger"
        :trigger-aria-label="CALENDAR_TRIGGER_LABEL"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="PAIR_FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>

        <template #renderSeparator>
            <PageDateRangeSeparator />
        </template>

        <template #renderTrigger="flags">
            <PageDatePickerTrigger :flags="flags" />
        </template>

        <template #renderDay="{ flags }">
            <PageCalendarDay :render-props="flags" />
        </template>

        <template #renderWeekday="{ name }">
            <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
        </template>

        <template #renderPopup="{ renderCalendar, month }">
            <PageCalendarFrame>
                <PageCalendarCaption v-model:month="month.value" item-key="basic" :locale="LOCALE" />

                <component :is="renderCalendar" />
            </PageCalendarFrame>
        </template>
    </DateRangePicker>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${getValueText()}` }}</div>
</template>
