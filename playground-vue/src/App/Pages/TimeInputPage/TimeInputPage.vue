<script setup lang="ts">
import { shallowRef } from "vue";

import { CLOSING_TIME, OPENING_TIME } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import TimeExample from "./Examples/Time.vue";

const EXAMPLES_ROOT = "/src/App/Pages/TimeInputPage/Examples";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

const time = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30 });
const twelveHourTime = shallowRef<TimeValue | undefined>({ hour: 14, minute: 30 });
const preciseTime = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
const shiftTime = shallowRef<TimeValue | undefined>();

const examples: ExampleDefs[] = [
    {
        key: "time",
        name: "A time, typed or stepped",
        readout: () => `value: ${describeTime(time.value)} — the arrows step whichever segment the caret is in`,
        path: `${EXAMPLES_ROOT}/Time.vue`,
    },
    {
        key: "twelve",
        name: "Twelve hour",
        readout: () => `value: ${describeTime(twelveHourTime.value)} — the value stays 24-hour, the field reads it as 12`,
        path: `${EXAMPLES_ROOT}/Time.vue`,
    },
    {
        key: "precise",
        name: "To the second",
        readout: () => `value: ${describeTime(preciseTime.value)} — three segments instead of two`,
        path: `${EXAMPLES_ROOT}/Time.vue`,
    },
    {
        key: "shift",
        name: "Within opening hours",
        readout: () =>
            `value: ${describeTime(shiftTime.value)} — ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
        path: `${EXAMPLES_ROOT}/Time.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #time>
            <TimeExample v-model:value="time" ariaLabel="Start time" />
        </template>

        <template #twelve>
            <TimeExample v-model:value="twelveHourTime" is-twelve-hour ariaLabel="Meeting time" />
        </template>

        <template #precise>
            <TimeExample v-model:value="preciseTime" has-seconds ariaLabel="Exact time" />
        </template>

        <template #shift>
            <TimeExample
                v-model:value="shiftTime"
                :min-value="OPENING_TIME"
                :max-value="CLOSING_TIME"
                ariaLabel="Shift start"
            />
        </template>
    </PageExamples>
</template>
