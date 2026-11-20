<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueRange } from "@thewaver/ss-components-vue";
import { Button, DateValueUtils, RangeCalendar } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarHeader from "../../../StyledComponents/CalendarContent/PageCalendarHeader.vue";
import PageCalendarTitle from "../../../StyledComponents/CalendarContent/PageCalendarTitle.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";

const MONTH_COUNT = 2;
const MONTH_STEP = 1;

const value = shallowRef<DateValueRange | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));

const page = (direction: 1 | -1) => {
    month.value = DateValueUtils.addMonths(month.value, direction * MONTH_STEP);
};
</script>

<template>
    <PageCalendarFrame>
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

            <template #renderMonthHeader="{ month: headerMonth, index }">
                <PageCalendarHeader>
                    <Button v-if="index === 0" id="twoMonthsPreviousMonth" ariaLabel="Previous month" @click="page(-1)">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">◀</PageButtonContent>
                        </template>
                    </Button>

                    <PageCalendarTitle :flags="{}">{{
                        DateValueUtils.format(headerMonth, MONTH_HEADER_OPTIONS, LOCALE)
                    }}</PageCalendarTitle>

                    <Button
                        v-if="index === MONTH_COUNT - 1"
                        id="twoMonthsNextMonth"
                        ariaLabel="Next month"
                        @click="page(1)"
                    >
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">▶</PageButtonContent>
                        </template>
                    </Button>
                </PageCalendarHeader>
            </template>
        </RangeCalendar>
    </PageCalendarFrame>
</template>
