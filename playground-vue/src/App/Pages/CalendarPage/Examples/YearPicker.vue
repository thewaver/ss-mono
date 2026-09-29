<script setup lang="ts">
import { useModel } from "vue";

import { Calendar, DateValueUtils } from "@thewaver/ss-components-vue";
import { LOCALE, MAX_YEAR, MIN_YEAR, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.vue";
import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };

type Props = CalendarPrecisionExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const month = useModel(props, "month");
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
