<script setup lang="ts">
import { shallowRef } from "vue";

import { PALETTE } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import CompactExample from "./Examples/Compact.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import LabeledExample from "./Examples/Labeled.vue";
import ReachableExample from "./Examples/Reachable.vue";
import SnappingExample from "./Examples/Snapping.vue";

const EXAMPLES_ROOT = "/src/App/Pages/ColorInputPage/Examples";

const defaultValue = shallowRef("#3366ff");
const compactValue = shallowRef("#3366ff");
const snappingValue = shallowRef(PALETTE[0]);
const disabledValue = shallowRef("#888888");
const reachableValue = shallowRef("#888888");
const erroredValue = shallowRef("#000000");
const labeledValue = shallowRef("#ff0055");

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${defaultValue.value} — the swatch is the painter's, not the browser's`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "compact",
        name: "Compact",
        readout: () => `value: ${compactValue.value} — swatch only, no hex readout`,
        path: `${EXAMPLES_ROOT}/Compact.vue`,
    },
    {
        key: "snapping",
        name: "Snapping setter",
        readout: () => `value: ${snappingValue.value} — snapped to the nearest of four`,
        path: `${EXAMPLES_ROOT}/Snapping.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `value: ${disabledValue.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `value: ${reachableValue.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `value: ${erroredValue.value} — black is not a brand color`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
    {
        key: "label",
        name: "In a Label",
        readout: () => `value: ${labeledValue.value} — the caption opens the picker`,
        path: `${EXAMPLES_ROOT}/Labeled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="defaultValue" />
        </template>

        <template #compact>
            <CompactExample v-model:value="compactValue" />
        </template>

        <template #snapping>
            <SnappingExample v-model:value="snappingValue" />
        </template>

        <template #disabled>
            <DisabledExample v-model:value="disabledValue" />
        </template>

        <template #reachable>
            <ReachableExample v-model:value="reachableValue" />
        </template>

        <template #errored>
            <ErroredExample v-model:value="erroredValue" />
        </template>

        <template #label>
            <LabeledExample v-model:value="labeledValue" />
        </template>
    </PageExamples>
</template>
