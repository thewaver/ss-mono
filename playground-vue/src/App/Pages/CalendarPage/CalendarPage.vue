<script setup lang="ts">
import { type Ref, computed, shallowRef } from "vue";

import type { DateValue, DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-vue";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
import {
    MAX_DATE,
    MAX_YEAR,
    MIN_DATE,
    MIN_YEAR,
    TODAY,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BoundedExample from "./Examples/Bounded.vue";
import DefaultExample from "./Examples/Default.vue";
import MonthPickerExample from "./Examples/MonthPicker.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import WeekdaysExample from "./Examples/Weekdays.vue";
import YearPickerExample from "./Examples/YearPicker.vue";

const CALENDAR_FIELD_WIDTH = 180;
const EXAMPLES_ROOT = "/src/App/Pages/CalendarPage/Examples";
const CALENDAR_IDS = DateValueUtils.getCalendarIds();
const WEEK_STARTS: DateValueWeekStart[] = [...CalendarKnobs.WEEK_STARTS];

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const useMonthState = (calendarId: Ref<DateValueCalendarId>) => {
    const month = shallowRef<DateValue>(DateValueUtils.getStartOfMonth(TODAY));

    return computed({
        get: () => DateValueUtils.withCalendar(month.value, calendarId.value),
        set: (next: DateValue) => {
            month.value = next;
        },
    });
};

const calendarId = shallowRef<DateValueCalendarId>(CalendarKnobs.STARTING_CALENDAR);
const weekStartsOn = shallowRef<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

const defaultValue = shallowRef<DateValue | undefined>(TODAY);
const rangedValue = shallowRef<DateValue | undefined>();
const weekdaysValue = shallowRef<DateValue | undefined>();
const rightToLeftValue = shallowRef<DateValue | undefined>(TODAY);

const defaultMonth = useMonthState(calendarId);
const rangedMonth = useMonthState(calendarId);
const weekdaysMonth = useMonthState(calendarId);
const rightToLeftMonth = useMonthState(calendarId);

const monthPickerValue = shallowRef<DateValue | undefined>();
const yearPickerValue = shallowRef<DateValue | undefined>();
const monthPickerPage = useMonthState(calendarId);
const yearPickerPage = useMonthState(calendarId);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${describe(defaultValue.value)} — month: ${describe(defaultMonth.value)}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "bounded",
        name: "Bounded",
        readout: () => `min ${describe(MIN_DATE)}, max ${describe(MAX_DATE)} — value: ${describe(rangedValue.value)}`,
        path: `${EXAMPLES_ROOT}/Bounded.vue`,
    },
    {
        key: "weekdays",
        name: "Weekdays only",
        readout: () =>
            `week starts on ${WEEK_START_LABELS[weekStartsOn.value]} — value: ${describe(weekdaysValue.value)}`,
        path: `${EXAMPLES_ROOT}/Weekdays.vue`,
    },
    {
        key: "rightToLeft",
        name: "In a right-to-left box",
        readout: () =>
            `value: ${describe(rightToLeftValue.value)} — the box around the calendar sets dir="rtl", so each week runs from the right and the right arrow moves to the day before`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "monthPicker",
        name: "Month picker",
        readout: () =>
            `value: ${describe(monthPickerValue.value)} — precision="month": the grid holds the year's months, a pick sets the first of the month, and the page keys step a year`,
        path: `${EXAMPLES_ROOT}/MonthPicker.vue`,
    },
    {
        key: "yearPicker",
        name: "Year picker",
        readout: () =>
            `value: ${describe(yearPickerValue.value)} — precision="year": twelve years to a page, bounded to ${MIN_YEAR.year}–${MAX_YEAR.year}, and a pick sets the first day of the year`,
        path: `${EXAMPLES_ROOT}/YearPicker.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="calendarId"
            label="Calendar"
            hint="Which calendar system the dates are read and written in, such as Gregorian or Islamic."
        >
            <PageSelectField
                :value="calendarId"
                :values="CALENDAR_IDS"
                :width="CALENDAR_FIELD_WIDTH"
                ariaLabel="Calendar system"
                @change="(id: DateValueCalendarId) => (calendarId = id)"
            />
        </PageProp>

        <PageProp
            item-key="weekStartsOn"
            label="Week starts on"
            hint="Which day begins a week, which decides the order of the column headings."
        >
            <PageSelectField
                :value="weekStartsOn"
                :values="WEEK_STARTS"
                ariaLabel="Week starts on"
                :compute-label="(day: DateValueWeekStart) => WEEK_START_LABELS[day]"
                @change="(day: DateValueWeekStart) => (weekStartsOn = day)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" :min-column-width="400">
        <template #default>
            <DefaultExample v-model:value="defaultValue" v-model:month="defaultMonth" :week-starts-on="weekStartsOn" />
        </template>

        <template #bounded>
            <BoundedExample v-model:value="rangedValue" v-model:month="rangedMonth" :week-starts-on="weekStartsOn" />
        </template>

        <template #weekdays>
            <WeekdaysExample
                v-model:value="weekdaysValue"
                v-model:month="weekdaysMonth"
                :week-starts-on="weekStartsOn"
            />
        </template>

        <template #rightToLeft>
            <RightToLeftExample
                v-model:value="rightToLeftValue"
                v-model:month="rightToLeftMonth"
                :week-starts-on="weekStartsOn"
            />
        </template>

        <template #monthPicker>
            <MonthPickerExample v-model:value="monthPickerValue" v-model:month="monthPickerPage" />
        </template>

        <template #yearPicker>
            <YearPickerExample v-model:value="yearPickerValue" v-model:month="yearPickerPage" />
        </template>
    </PageExamples>
</template>
