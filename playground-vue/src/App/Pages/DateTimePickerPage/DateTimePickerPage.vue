<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateTimeValue } from "@thewaver/ss-components-vue";
import { DateTimeValueUtils, DateValueUtils } from "@thewaver/ss-components-vue";
import { TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PairedExample from "./Examples/Paired.vue";
import PickedExample from "./Examples/Picked.vue";

const EXAMPLES_ROOT = "/src/App/Pages/DateTimePickerPage/Examples";
const NOON = { hour: 12, minute: 0 };

const describe = (value: DateTimeValue | undefined) =>
    value
        ? `${DateValueUtils.toIso(value.date)} at ${String(value.time.hour).padStart(2, "0")}:${String(value.time.minute).padStart(2, "0")}`
        : "none";

const emptyValue = shallowRef<DateTimeValue | undefined>();
const seededValue = shallowRef<DateTimeValue | undefined>(DateTimeValueUtils.of(TODAY, NOON));
const pickedValue = shallowRef<DateTimeValue | undefined>();
const twelveHourValue = shallowRef<DateTimeValue | undefined>();

const examples: ExampleDefs[] = [
    {
        key: "paired",
        name: "Two fields, one value",
        readout: () => `value: ${describe(emptyValue.value)}`,
        path: `${EXAMPLES_ROOT}/Paired.vue`,
    },
    {
        key: "picked",
        name: "One control, both popups",
        readout: () => `value: ${describe(pickedValue.value)}`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
    {
        key: "twelveHour",
        name: "Twelve hour, with seconds",
        readout: () => `value: ${describe(twelveHourValue.value)}`,
        path: `${EXAMPLES_ROOT}/Picked.vue`,
    },
    {
        key: "seeded",
        name: "Starting from a value",
        readout: () =>
            `value: ${describe(seededValue.value)} — seconds of day: ${
                seededValue.value ? TimeUtils.getSecondOfDay(seededValue.value.time) : 0
            }`,
        path: `${EXAMPLES_ROOT}/Paired.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples" :min-column-width="520">
        <template #paired>
            <PairedExample v-model:value="emptyValue" />
        </template>

        <template #picked>
            <PickedExample v-model:value="pickedValue" item-key="picked" />
        </template>

        <template #twelveHour>
            <PickedExample v-model:value="twelveHourValue" item-key="twelveHour" is-twelve-hour has-seconds />
        </template>

        <template #seeded>
            <PairedExample v-model:value="seededValue" />
        </template>
    </PageExamples>
</template>
