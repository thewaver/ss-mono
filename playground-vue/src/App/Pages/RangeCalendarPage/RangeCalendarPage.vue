<script setup lang="ts">
import { type Ref, computed, shallowRef } from "vue";

import type { DateValue, DateValueCalendarId, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-vue";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
import {
    MAX_DATE,
    MIN_DATE,
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

const CALENDAR_FIELD_WIDTH = 180;
const CALENDAR_IDS = DateValueUtils.getCalendarIds();
const EXAMPLES_ROOT = "/src/App/Pages/RangeCalendarPage/Examples";

const describe = (value: DateValueRange | undefined) =>
    value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "none";

const useMonthState = (calendarId: Ref<DateValueCalendarId>) => {
    const month = shallowRef<DateValue>(DateValueUtils.getStartOfMonth(TODAY));

    return computed({
        get: () => DateValueUtils.withCalendar(month.value, calendarId.value),
        set: (next: DateValue) => {
            month.value = next;
        },
    });
};

const calendarId = shallowRef<DateValueCalendarId>(RangeCalendarKnobs.STARTING_CALENDAR);
const weekStartsOn = shallowRef<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

const defaultValue = shallowRef<DateValueRange | undefined>();
const boundedValue = shallowRef<DateValueRange | undefined>();

const defaultMonth = useMonthState(calendarId);
const boundedMonth = useMonthState(calendarId);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${describe(defaultValue.value)}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "bounded",
        name: "Bounded",
        readout: () =>
            `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue.value)}`,
        path: `${EXAMPLES_ROOT}/Bounded.vue`,
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
                :values="RangeCalendarKnobs.WEEK_STARTS"
                ariaLabel="Week starts on"
                :compute-label="(day) => WEEK_START_LABELS[day]"
                @change="(day: DateValueWeekStart) => (weekStartsOn = day)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="defaultValue" v-model:month="defaultMonth" :week-starts-on="weekStartsOn" />
        </template>

        <template #bounded>
            <BoundedExample v-model:value="boundedValue" v-model:month="boundedMonth" :week-starts-on="weekStartsOn" />
        </template>
    </PageExamples>
</template>
