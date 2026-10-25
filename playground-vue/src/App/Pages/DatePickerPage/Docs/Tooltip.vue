<script setup lang="ts">
import { h, shallowRef } from "vue";

import type { DateValue, InteractionTooltipDefs, TextFieldFlags } from "@thewaver/ss-components-vue";
import { DatePicker } from "@thewaver/ss-components-vue";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
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
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { DatePickerTooltipDocsExampleProps } from "../DatePickerPageVue.types";

type Props = DatePickerTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef<DateValue | undefined>(TODAY);

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a date picker."),
};
</script>

<template>
    <DatePicker
        v-model:value="value"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Date with a tooltip"
        calendar-label="Choose a date"
        :part-hints="DATE_PART_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        :tooltip-defs="tooltipDefs"
        trigger-id="tooltipTrigger"
        :trigger-aria-label="CALENDAR_TRIGGER_LABEL"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
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
                <PageCalendarCaption v-model:month="month.value" item-key="tooltip" :locale="LOCALE" />

                <component :is="renderCalendar" />
            </PageCalendarFrame>
        </template>
    </DatePicker>
</template>
