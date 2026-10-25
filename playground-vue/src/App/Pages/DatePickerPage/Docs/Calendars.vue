<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { DatePicker, DateValueUtils } from "@thewaver/ss-components-vue";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { DatePickerCalendarsDocsExampleProps } from "../DatePickerPageVue.types";

type Props = DatePickerCalendarsDocsExampleProps;

defineProps<Props>();

const value = shallowRef<DateValue | undefined>(TODAY);

const getValueText = () => (value.value ? DateValueUtils.toIso(value.value) : "nothing");
</script>

<template>
    <DatePicker
        v-model:value="value"
        :calendar="calendar"
        ariaLabel="Date"
        calendar-label="Choose a date"
        :part-hints="DATE_PART_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        trigger-id="calendarsTrigger"
        :trigger-aria-label="CALENDAR_TRIGGER_LABEL"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>

        <template #renderLeading="{ flags, era }">
            <PageEraCycle
                :era="era.value"
                :options="era.options"
                :is-disabled="flags.isDisabled ?? false"
                @change="era.set"
            />
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
                <PageCalendarCaption v-model:month="month.value" item-key="calendars" :locale="LOCALE" />

                <component :is="renderCalendar" />
            </PageCalendarFrame>
        </template>
    </DatePicker>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${getValueText()}` }}</div>
</template>
