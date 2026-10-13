<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    UPLOAD_TICK_BYTES,
    UPLOAD_TICK_MS,
    UPLOAD_TOTAL_BYTES,
} from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DeterminateExample from "./Examples/Determinate.vue";
import DiskMeterExample from "./Examples/DiskMeter.vue";
import ErroredExample from "./Examples/Errored.vue";
import FillingContainerExample from "./Examples/FillingContainer.vue";
import IndeterminateExample from "./Examples/Indeterminate.vue";
import LiveRangeExample from "./Examples/LiveRange.vue";
import OutOfRangeExample from "./Examples/OutOfRange.vue";
import RingExample from "./Examples/Ring.vue";

const uploadedBytes = shallowRef(0);

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
    timer = setInterval(() => {
        uploadedBytes.value = uploadedBytes.value >= UPLOAD_TOTAL_BYTES ? 0 : uploadedBytes.value + UPLOAD_TICK_BYTES;
    }, UPLOAD_TICK_MS);
});

onBeforeUnmount(() => {
    clearInterval(timer);
});

const examples: ExampleDefs[] = [
    {
        key: "determinate",
        name: EXAMPLE_NAMES.determinate,
        readout: () => "ratio: 0.4 — a plain 0..1 value, which is what the painter is handed",
        path: `${EXAMPLES_ROOT}/Determinate.vue`,
    },
    {
        key: "indeterminate",
        name: EXAMPLE_NAMES.indeterminate,
        readout: () => "no value at all, so aria-valuenow is absent and the painter animates instead",
        path: `${EXAMPLES_ROOT}/Indeterminate.vue`,
    },
    {
        key: "liveRange",
        name: EXAMPLE_NAMES.liveRange,
        readout: () => `${uploadedBytes.value} of ${UPLOAD_TOTAL_BYTES} bytes — min and max are the real units`,
        path: `${EXAMPLES_ROOT}/LiveRange.vue`,
    },
    {
        key: "outOfRange",
        name: EXAMPLE_NAMES.outOfRange,
        readout: () => "value: 5 against a 0..1 range — clamped rather than drawn past the end",
        path: `${EXAMPLES_ROOT}/OutOfRange.vue`,
    },
    {
        key: "errored",
        name: EXAMPLE_NAMES.errored,
        readout: () => "value: 0.62 — the transfer stalled, and hasError is the owner's to say",
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
    {
        key: "diskMeter",
        name: EXAMPLE_NAMES.diskMeter,
        readout: () =>
            'role="meter" — a reading of how full the disk is rather than work that will finish, so it is announced as a gauge and has no indeterminate state',
        path: `${EXAMPLES_ROOT}/DiskMeter.vue`,
    },
    {
        key: "ring",
        name: EXAMPLE_NAMES.ring,
        readout: () =>
            `${uploadedBytes.value} of ${UPLOAD_TOTAL_BYTES} bytes — the same upload as the live range, painted round a circle; the component is unchanged`,
        path: `${EXAMPLES_ROOT}/Ring.vue`,
    },
    {
        key: "fillingContainer",
        name: EXAMPLE_NAMES.fillingContainer,
        readout: () => "sizing: fill — the default, since a track's natural width is its container's",
        path: `${EXAMPLES_ROOT}/FillingContainer.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #determinate>
            <DeterminateExample />
        </template>

        <template #indeterminate>
            <IndeterminateExample />
        </template>

        <template #liveRange>
            <LiveRangeExample :uploaded-bytes="uploadedBytes" :upload-total-bytes="UPLOAD_TOTAL_BYTES" />
        </template>

        <template #outOfRange>
            <OutOfRangeExample />
        </template>

        <template #errored>
            <ErroredExample />
        </template>

        <template #diskMeter>
            <DiskMeterExample />
        </template>

        <template #ring>
            <RingExample :uploaded-bytes="uploadedBytes" :upload-total-bytes="UPLOAD_TOTAL_BYTES" />
        </template>

        <template #fillingContainer>
            <FillingContainerExample />
        </template>
    </PageExamples>
</template>
