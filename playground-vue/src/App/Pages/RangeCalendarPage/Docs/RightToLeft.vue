<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueRange } from "@thewaver/ss-components-vue";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";

const value = shallowRef<DateValueRange | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));
</script>

<template>
    <div dir="rtl">
        <PageCalendarFrame>
            <PageCalendarCaption v-model:month="month" item-key="rightToLeft" :locale="LOCALE" />

            <RangeCalendar
                v-model:value="value"
                v-model:month="month"
                :today="TODAY"
                :locale="LOCALE"
                ariaLabel="Choose a date range in a right-to-left box"
            >
                <template #renderDay="{ flags }">
                    <PageCalendarDay :render-props="flags" />
                </template>

                <template #renderWeekday="{ name }">
                    <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
                </template>
            </RangeCalendar>
        </PageCalendarFrame>
    </div>
</template>
