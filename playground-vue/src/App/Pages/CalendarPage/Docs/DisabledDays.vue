<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY, WEEKEND_DAYS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";

const value = shallowRef<DateValue | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="disabledDays" :locale="LOCALE" />

        <Calendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            :disabled-days="[{ daysOfWeek: WEEKEND_DAYS }]"
            ariaLabel="Choose a working day"
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
