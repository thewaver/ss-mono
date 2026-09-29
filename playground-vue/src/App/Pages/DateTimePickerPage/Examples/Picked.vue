<script setup lang="ts">
import { useModel } from "vue";

import { DateTimePicker } from "@thewaver/ss-components-vue";
import {
    CALENDAR_TRIGGER_LABEL,
    CLOCK_TRIGGER_LABEL,
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageMeridiemToggle from "../../../PageComponents/MeridiemToggle/MeridiemToggle.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.vue";
import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.vue";
import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.vue";
import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.vue";
import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import PageTimePickerTrigger from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger.vue";
import type { DateTimeExampleProps } from "../DateTimePickerPage.types";
import PageDateTimeSeparator from "../PageDateTimeSeparator.vue";

type Props = DateTimeExampleProps & {
    itemKey: string;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <DateTimePicker
        v-model:value="value"
        :is-twelve-hour="isTwelveHour"
        :has-seconds="hasSeconds"
        date-label="Date"
        time-label="Time"
        calendar-label="Choose a date"
        clock-label="Choose a time"
        :part-hints="DATE_PART_HINTS"
        :segment-hints="TIME_SEGMENT_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        :trigger-id="`${itemKey}DateTrigger`"
        :trigger-aria-label="CALENDAR_TRIGGER_LABEL"
        :time-trigger-id="`${itemKey}TimeTrigger`"
        :time-trigger-aria-label="CLOCK_TRIGGER_LABEL"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>

        <template #renderSeparator>
            <PageDateTimeSeparator />
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
                <PageCalendarCaption v-model:month="month.value" :item-key="itemKey" :locale="LOCALE" />

                <component :is="renderCalendar" />
            </PageCalendarFrame>
        </template>

        <template #renderTimeTrailing="{ flags, meridiem }">
            <PageMeridiemToggle
                v-if="isTwelveHour"
                :meridiem="meridiem.value"
                :is-disabled="flags.isDisabled ?? false"
                @toggle="meridiem.toggle"
            />
        </template>

        <template #renderTimeTrigger="{ flags }">
            <PageTimePickerTrigger :flags="flags" />
        </template>

        <template #renderOption="{ flags }">
            <PageClockOption :render-props="flags" />
        </template>

        <template #renderUnit="{ name }">
            <PageClockUnit>{{ name }}</PageClockUnit>
        </template>

        <template #renderColumn="{ renderOptions }">
            <PageClockColumn><component :is="renderOptions" /></PageClockColumn>
        </template>

        <template #renderTimePopup="{ renderClock }">
            <PageClockFrame><component :is="renderClock" /></PageClockFrame>
        </template>
    </DateTimePicker>
</template>
