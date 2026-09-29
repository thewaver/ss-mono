<script setup lang="ts">
import { useModel } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY, WEEKEND_DAYS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import type { CalendarExampleProps } from "../CalendarPage.types";

type Props = CalendarExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const month = useModel(props, "month");

const computeIsDayDisabled = (day: DateValue) => WEEKEND_DAYS.includes(DateValueUtils.toDate(day).getDay());
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="weekdays" :locale="LOCALE" />

        <Calendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            :week-starts-on="weekStartsOn"
            ariaLabel="Choose a working day"
            :compute-is-day-disabled="computeIsDayDisabled"
        >
            <template #renderDay="{ flags }">
                <PageCalendarDay :render-props="flags" />
            </template>

            <template #renderWeekday="{ name }">
                <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
            </template>
        </Calendar>
    </PageCalendarFrame>
</template>
