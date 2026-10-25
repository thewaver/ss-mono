<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { DateValue, DateValueRange } from "@thewaver/ss-components-vue";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-vue";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import type { RangeCalendarCalendarsDocsExampleProps } from "../RangeCalendarPageVue.types";

type Props = RangeCalendarCalendarsDocsExampleProps;

const props = defineProps<Props>();

const value = shallowRef<DateValueRange | undefined>();
const plainMonth = shallowRef(DateValueUtils.getStartOfMonth(TODAY));

const month = computed({
    get: () => DateValueUtils.withCalendar(plainMonth.value, props.calendar),
    set: (next: DateValue) => {
        plainMonth.value = next;
    },
});
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="calendars" :locale="LOCALE" />

        <RangeCalendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            ariaLabel="Choose a date range"
        >
            <template #renderDay="{ flags }">
                <PageCalendarDay :render-props="flags" />
            </template>

            <template #renderWeekday="{ name }">
                <PageCalendarWeekday>{{ name }}</PageCalendarWeekday>
            </template>
        </RangeCalendar>
    </PageCalendarFrame>
</template>
