<script setup lang="ts">
import { shallowRef } from "vue";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";
import {
    BOOKING_STEPS,
    CLOSING_TIME,
    OPENING_TIME,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

const defaultValue = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30 });
const twelveHourValue = shallowRef<TimeValue | undefined>({ hour: 14, minute: 30 });
const boundedValue = shallowRef<TimeValue | undefined>({ hour: 10, minute: 15 });

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () =>
            `value: ${describeTime(defaultValue.value)} — picking an hour and picking a minute are two independent choices, so no column has to list every time of day`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "twelve",
        name: EXAMPLE_NAMES.twelve,
        readout: () =>
            `value: ${describeTime(twelveHourValue.value)} — am and pm become a column of their own, and the value stays 24-hour`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "bounded",
        name: EXAMPLE_NAMES.bounded,
        readout: () =>
            `value: ${describeTime(boundedValue.value)} — quarter hours only, inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="defaultValue" ariaLabel="Appointment time" />
        </template>

        <template #twelve>
            <DefaultExample v-model:value="twelveHourValue" is-twelve-hour ariaLabel="Call time" />
        </template>

        <template #bounded>
            <DefaultExample
                v-model:value="boundedValue"
                :steps="BOOKING_STEPS"
                :min-value="OPENING_TIME"
                :max-value="CLOSING_TIME"
                ariaLabel="Booking time"
            />
        </template>
    </PageExamples>
</template>
