<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueRange } from "@thewaver/ss-components-vue";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarTitle from "../../../StyledComponents/CalendarContent/PageCalendarTitle.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";

const MONTH_COUNT = 2;

const value = shallowRef<DateValueRange | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="twoMonths" :locale="LOCALE" />

        <RangeCalendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            :month-count="MONTH_COUNT"
            ariaLabel="Choose a date range"
        >
            <template #renderDay="{ flags }">
                <PageCalendarDay :render-props="flags" />
            </template>

            <template #renderWeekday="{ name }">
                <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
            </template>

            <template #renderMonthHeader="{ month: headerMonth }">
                <PageCalendarTitle :flags="{}">{{
                    DateValueUtils.format(headerMonth, MONTH_HEADER_OPTIONS, LOCALE)
                }}</PageCalendarTitle>
            </template>
        </RangeCalendar>
    </PageCalendarFrame>
</template>
