<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.vue";
import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

const value = shallowRef<DateValue | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarPagedCaption
            v-model:month="month"
            item-key="monthPicker"
            :locale="LOCALE"
            precision="month"
            previous-label="Previous year"
            next-label="Next year"
        />

        <Calendar
            v-model:value="value"
            v-model:month="month"
            precision="month"
            :today="TODAY"
            :locale="LOCALE"
            ariaLabel="Choose a month"
        >
            <template #renderDay="{ day, flags }">
                <PageCalendarCell :render-props="flags">{{
                    DateValueUtils.format(day, CELL_OPTIONS, LOCALE)
                }}</PageCalendarCell>
            </template>
        </Calendar>
    </PageCalendarFrame>
</template>
