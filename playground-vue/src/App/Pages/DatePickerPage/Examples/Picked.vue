<script setup lang="ts">
import { computed, useModel } from "vue";

import type { CalendarPrecision, DateValue } from "@thewaver/ss-components-vue";
import { DatePicker, DateValueUtils } from "@thewaver/ss-components-vue";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.vue";
import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.vue";
import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { DateExampleProps } from "../DatePickerPage.types";

const MONTH_CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

type Props = DateExampleProps & {
    itemKey: string;
    precision?: CalendarPrecision;
    minValue?: DateValue;
    maxValue?: DateValue;
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

const props = defineProps<Props>();

const value = useModel(props, "value");

const isMonthPrecision = computed(() => props.precision === "month");
</script>

<template>
    <DatePicker
        v-model:value="value"
        :calendar="calendar"
        :min-value="minValue"
        :max-value="maxValue"
        :compute-is-day-disabled="computeIsDayDisabled"
        :precision="precision"
        ariaLabel="Date"
        calendar-label="Choose a date"
        :part-hints="DATE_PART_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        :trigger-id="`${itemKey}Trigger`"
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

        <template #renderDay="{ day, flags }">
            <PageCalendarCell v-if="isMonthPrecision" :render-props="flags">{{
                DateValueUtils.format(day, MONTH_CELL_OPTIONS, LOCALE)
            }}</PageCalendarCell>

            <PageCalendarDay v-else :render-props="flags" />
        </template>

        <template #renderWeekday="{ name }">
            <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
        </template>

        <template #renderPopup="{ renderCalendar, month }">
            <PageCalendarFrame>
                <PageCalendarPagedCaption
                    v-if="isMonthPrecision"
                    v-model:month="month.value"
                    :item-key="itemKey"
                    :locale="LOCALE"
                    precision="month"
                    previous-label="Previous year"
                    next-label="Next year"
                />

                <PageCalendarCaption v-else v-model:month="month.value" :item-key="itemKey" :locale="LOCALE" />

                <component :is="renderCalendar" />
            </PageCalendarFrame>
        </template>
    </DatePicker>
</template>
