<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-vue";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { CAESAR, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import TypedExample from "./Examples/Typed.vue";

const CALENDAR_FIELD_WIDTH = 180;
const CALENDAR_IDS = DateValueUtils.getCalendarIds();
const EXAMPLES_ROOT = "/src/App/Pages/DateInputPage/Examples";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const calendarId = shallowRef<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

const typed = shallowRef<DateValue | undefined>(TODAY);
const locale = shallowRef<DateValue | undefined>(TODAY);
const era = shallowRef<DateValue | undefined>(CAESAR);

const examples: ExampleDefs[] = [
    {
        key: "typed",
        name: "Typed only",
        readout: () => `value: ${describe(typed.value)} — a half-typed or impossible date leaves this value alone`,
        path: `${EXAMPLES_ROOT}/Typed.vue`,
    },
    {
        key: "locale",
        name: "Day first",
        readout: () =>
            `value: ${describe(locale.value)} — dd/mm/yyyy, and the separators are the mask's rather than yours to type`,
        path: `${EXAMPLES_ROOT}/Typed.vue`,
    },
    {
        key: "era",
        name: "Before the common era",
        readout: () =>
            `value: ${describe(era.value)} — the era is a control in the leading slot, offering whatever the calendar reports`,
        path: `${EXAMPLES_ROOT}/Typed.vue`,
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
                ariaLabel="Calendar"
                @change="(id: DateValueCalendarId) => (calendarId = id)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #typed>
            <TypedExample v-model:value="typed" :calendar="calendarId" ariaLabel="Start date" />
        </template>

        <template #locale>
            <TypedExample
                v-model:value="locale"
                :calendar="calendarId"
                format="day-month-year"
                ariaLabel="Day-first date"
            />
        </template>

        <template #era>
            <TypedExample v-model:value="era" :calendar="calendarId" ariaLabel="Historical date" />
        </template>
    </PageExamples>
</template>
