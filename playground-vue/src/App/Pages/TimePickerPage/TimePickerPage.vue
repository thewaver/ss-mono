<script setup lang="ts">
import { shallowRef } from "vue";

import {
    BOOKING_STEPS,
    CLOSING_TIME,
    OPENING_TIME,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import ClockedExample from "./Examples/Clocked.vue";

const EXAMPLES_ROOT = "/src/App/Pages/TimePickerPage/Examples";

const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

const clockedTime = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30 });
const clockedTwelveTime = shallowRef<TimeValue | undefined>({ hour: 14, minute: 30 });
const bookingTime = shallowRef<TimeValue | undefined>({ hour: 10, minute: 15 });

const examples: ExampleDefs[] = [
    {
        key: "clocked",
        name: "With a clock",
        readout: () =>
            `value: ${describeTime(clockedTime.value)} — one column per unit, so typing and picking cover the same times`,
        path: `${EXAMPLES_ROOT}/Clocked.vue`,
    },
    {
        key: "clockedTwelve",
        name: "Twelve hour, with a clock",
        readout: () =>
            `value: ${describeTime(clockedTwelveTime.value)} — the am/pm control and the clock trigger share the trailing slot`,
        path: `${EXAMPLES_ROOT}/Clocked.vue`,
    },
    {
        key: "booking",
        name: "Every fifteen minutes",
        readout: () =>
            `value: ${describeTime(bookingTime.value)} — a coarser minute column, still inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
        path: `${EXAMPLES_ROOT}/Clocked.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #clocked>
            <ClockedExample v-model:value="clockedTime" item-key="clocked" ariaLabel="Appointment time" />
        </template>

        <template #clockedTwelve>
            <ClockedExample
                v-model:value="clockedTwelveTime"
                item-key="clockedTwelve"
                is-twelve-hour
                ariaLabel="Call time"
            />
        </template>

        <template #booking>
            <ClockedExample
                v-model:value="bookingTime"
                item-key="booking"
                :clock-steps="BOOKING_STEPS"
                :min-value="OPENING_TIME"
                :max-value="CLOSING_TIME"
                ariaLabel="Booking time"
            />
        </template>
    </PageExamples>
</template>
