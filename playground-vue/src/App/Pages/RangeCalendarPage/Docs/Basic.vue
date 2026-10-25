<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { DateValueRange } from "@thewaver/ss-components-vue";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.vue";
import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.vue";
import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.vue";
import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.vue";
import type { RangeCalendarBasicDocsExampleProps } from "../RangeCalendarPageVue.types";

type Props = RangeCalendarBasicDocsExampleProps;

defineProps<Props>();

const value = shallowRef<DateValueRange | undefined>();
const month = shallowRef(DateValueUtils.getStartOfMonth(TODAY));

const valueText = computed(() =>
    value.value ? `${DateValueUtils.toIso(value.value.start)} to ${DateValueUtils.toIso(value.value.end)}` : "nothing",
);
</script>

<template>
    <PageCalendarFrame>
        <PageCalendarCaption v-model:month="month" item-key="basic" :locale="LOCALE" />

        <RangeCalendar
            v-model:value="value"
            v-model:month="month"
            :today="TODAY"
            :locale="LOCALE"
            :week-starts-on="weekStartsOn"
            :is-disabled="isDisabled"
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${valueText}` }}</div>
</template>
