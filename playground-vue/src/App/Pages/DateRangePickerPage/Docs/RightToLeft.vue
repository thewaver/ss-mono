<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueRange } from "@thewaver/ss-components-vue";
import { DateRangePicker } from "@thewaver/ss-components-vue";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
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
import PageDateRangeSeparator from "../PageDateRangeSeparator.vue";

const value = shallowRef<DateValueRange | undefined>(undefined);
</script>

<template>
    <div dir="rtl">
        <DateRangePicker
            v-model:value="value"
            start-label="Start date"
            end-label="End date"
            calendar-label="Choose a date range"
            :part-hints="DATE_PART_HINTS"
            :locale="LOCALE"
            :padding="FIELD_STEPPER_PADDING"
            :gap="FIELD_GAP"
            :compute-text-style="computePageTextFieldTextStyle"
            trigger-id="rightToLeftTrigger"
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
                    <PageCalendarCaption v-model:month="month.value" item-key="rightToLeft" :locale="LOCALE" />

                    <component :is="renderCalendar" />
                </PageCalendarFrame>
            </template>
        </DateRangePicker>
    </div>
</template>
