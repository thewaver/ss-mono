<script setup lang="ts">
import { useModel } from "vue";

import { Calendar } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import type { CalendarWeekNumbersExampleProps } from "../CalendarPage.types";

type Props = CalendarWeekNumbersExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const month = useModel(props, "month");
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="weekNumbers" :locale="LOCALE" />

        <Calendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            :week-starts-on="weekStartsOn"
            :min-days-in-first-week="minDaysInFirstWeek"
            ariaLabel="Choose a date"
        >
            <template #renderDay="{ flags }">
                <PageCalendarDay :render-props="flags" />
            </template>

            <template #renderWeekday="{ name }">
                <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
            </template>

            <template #renderWeekNumber="{ weekNumber }">
                <PageCalendarWeekday>{{ weekNumber }}</PageCalendarWeekday>
            </template>
        </Calendar>
    </PageCalendarFrame>
</template>
