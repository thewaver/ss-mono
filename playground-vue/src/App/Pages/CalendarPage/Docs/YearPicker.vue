<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-vue";
import { LOCALE, MAX_YEAR, MIN_YEAR, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.vue";
import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };

const value = shallowRef<DateValue | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarPagedCaption
            v-model:month="month"
            item-key="yearPicker"
            :locale="LOCALE"
            precision="year"
            previous-label="Previous twelve years"
            next-label="Next twelve years"
        />

        <Calendar
            v-model:value="value"
            v-model:month="month"
            precision="year"
            :today="TODAY"
            :min-value="MIN_YEAR"
            :max-value="MAX_YEAR"
            :locale="LOCALE"
            ariaLabel="Choose a year"
        >
            <template #renderDay="{ day, flags }">
                <PageCalendarCell :render-props="flags">{{
                    DateValueUtils.format(day, CELL_OPTIONS, LOCALE)
                }}</PageCalendarCell>
            </template>
        </Calendar>
    </PageCalendarFrame>
</template>
