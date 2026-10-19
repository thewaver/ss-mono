<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-vue";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import {
    CALENDAR_FIELD_WIDTH,
    CALENDAR_IDS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    MAX_DATE,
    MIN_DATE,
    WEEKEND_OFFSET,
    WEEK_STARTS_ON_MONDAY,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PickedExample from "./Examples/Picked.vue";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const getIsWeekend = (day: DateValue) => DateValueUtils.getWeekdayOffset(day, WEEK_STARTS_ON_MONDAY) >= WEEKEND_OFFSET;

const calendarId = shallowRef<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

const picked = shallowRef<DateValue | undefined>();
const bounded = shallowRef<DateValue | undefined>();
const weekday = shallowRef<DateValue | undefined>();
const month = shallowRef<DateValue | undefined>();

const examples: ExampleDefs[] = [
    {
        key: "picked",
        name: EXAMPLE_NAMES.picked,
        readout: () => `value: ${describe(picked.value)} — typing and picking write the same signal`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
    {
        key: "bounded",
        name: EXAMPLE_NAMES.bounded,
        readout: () =>
            `value: ${describe(bounded.value)} — ${DateValueUtils.toIso(MIN_DATE)} to ${DateValueUtils.toIso(MAX_DATE)}, typed or picked`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
    {
        key: "weekdays",
        name: EXAMPLE_NAMES.weekdays,
        readout: () =>
            `value: ${describe(weekday.value)} — the calendar refuses a weekend, and typing one reports it as an error`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
    {
        key: "monthPrecision",
        name: EXAMPLE_NAMES.monthPrecision,
        readout: () =>
            `value: ${describe(month.value)} — precision="month" is handed to the calendar, so a pick there sets the first of the month; the field still takes a whole date`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="calendarId"
            controls="Sets DatePickerProps.calendar"
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
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #picked>
            <PickedExample v-model:value="picked" :calendar="calendarId" item-key="picked" />
        </template>

        <template #bounded>
            <PickedExample
                v-model:value="bounded"
                :calendar="calendarId"
                item-key="bounded"
                :min-value="MIN_DATE"
                :max-value="MAX_DATE"
            />
        </template>

        <template #weekdays>
            <PickedExample
                v-model:value="weekday"
                :calendar="calendarId"
                item-key="weekdays"
                :compute-is-day-disabled="getIsWeekend"
            />
        </template>

        <template #monthPrecision>
            <PickedExample v-model:value="month" :calendar="calendarId" item-key="monthPrecision" precision="month" />
        </template>
    </PageExamples>
</template>
