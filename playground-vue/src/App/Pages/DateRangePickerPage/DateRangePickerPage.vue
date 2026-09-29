<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-vue";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-vue";
import { MAX_DATE, MIN_DATE } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PickedExample from "./Examples/Picked.vue";

const CALENDAR_FIELD_WIDTH = 180;
const EXAMPLES_ROOT = "/src/App/Pages/DateRangePickerPage/Examples";

const describe = (value: DateValueRange | undefined) =>
    value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "none";

const calendarId = shallowRef<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

const defaultValue = shallowRef<DateValueRange | undefined>();
const boundedValue = shallowRef<DateValueRange | undefined>();

const examples: ExampleDefs[] = [
    {
        key: "picked",
        name: "Two fields, one value",
        readout: () => `value: ${describe(defaultValue.value)}`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
    {
        key: "bounded",
        name: "Bounded",
        readout: () =>
            `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue.value)}`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
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
                :values="DateValueUtils.getCalendarIds()"
                :width="CALENDAR_FIELD_WIDTH"
                ariaLabel="Calendar system"
                @change="(id: DateValueCalendarId) => (calendarId = id)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" :min-column-width="520">
        <template #picked>
            <PickedExample v-model:value="defaultValue" :calendar="calendarId" item-key="picked" />
        </template>

        <template #bounded>
            <PickedExample
                v-model:value="boundedValue"
                :calendar="calendarId"
                item-key="bounded"
                :min-value="MIN_DATE"
                :max-value="MAX_DATE"
            />
        </template>
    </PageExamples>
</template>
