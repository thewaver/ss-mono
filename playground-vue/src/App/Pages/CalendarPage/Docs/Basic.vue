<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import type { CalendarBasicDocsExampleProps } from "../CalendarPageVue.types";

type Props = CalendarBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef<DateValue | undefined>(TODAY);
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="basic" :locale="LOCALE" />

        <Calendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            :week-starts-on="weekStartsOn"
            :is-disabled="isDisabled"
            ariaLabel="Choose a date"
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
