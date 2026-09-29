<script setup lang="ts">
import { shallowRef } from "vue";

import type { RangeValues } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import DisabledPairExample from "./Examples/DisabledPair.vue";
import ErroredExample from "./Examples/Errored.vue";
import KnobExample from "./Examples/Knob.vue";
import PairExample from "./Examples/Pair.vue";
import PriceExample from "./Examples/Price.vue";
import ReachableExample from "./Examples/Reachable.vue";
import SteppedExample from "./Examples/Stepped.vue";
import VerticalExample from "./Examples/Vertical.vue";

const STEP_COUNT = 5;
const EXAMPLES_ROOT = "/src/App/Pages/RangePage/Examples";

const volume = shallowRef(40);
const steps = shallowRef(3);
const vertical = shallowRef(60);
const disabled = shallowRef(25);
const reachable = shallowRef(75);
const errored = shallowRef(90);
const knob = shallowRef(30);

const price = shallowRef<RangeValues>({ start: 20, end: 80 });
const budget = shallowRef<RangeValues>({ start: 100, end: 350 });
const settledBudget = shallowRef("not yet");
const verticalPair = shallowRef<RangeValues>({ start: 30, end: 70 });
const disabledPair = shallowRef<RangeValues>({ start: 35, end: 65 });

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${volume.value}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "stepped",
        name: "Stepped",
        readout: () => `value: ${steps.value} of ${STEP_COUNT}`,
        path: `${EXAMPLES_ROOT}/Stepped.vue`,
    },
    {
        key: "pair",
        name: "Pair",
        readout: () => `start: ${price.value.start} | end: ${price.value.end}`,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "priceRange",
        name: "Price range, read as prices",
        readout: () =>
            `start: ${budget.value.start} | end: ${budget.value.end} | settled: ${settledBudget.value} — each thumb reads its value as a price, and "settled" changes only when a drag lets go or a key is pressed`,
        path: `${EXAMPLES_ROOT}/Price.vue`,
    },
    {
        key: "vertical",
        name: "Vertical",
        readout: () => `single: ${vertical.value} | pair: ${verticalPair.value.start}–${verticalPair.value.end}`,
        path: `${EXAMPLES_ROOT}/Vertical.vue`,
    },
    {
        key: "knob",
        name: "Knob",
        readout: () =>
            `value: ${knob.value} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
        path: `${EXAMPLES_ROOT}/Knob.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `value: ${disabled.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "disabledPair",
        name: "Disabled pair",
        readout: () =>
            `start: ${disabledPair.value.start} | end: ${disabledPair.value.end} — both thumbs must be out of the tab order`,
        path: `${EXAMPLES_ROOT}/DisabledPair.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `value: ${reachable.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `value: ${errored.value}`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="volume" />
        </template>

        <template #stepped>
            <SteppedExample v-model:value="steps" />
        </template>

        <template #pair>
            <PairExample v-model:range="price" />
        </template>

        <template #priceRange>
            <PriceExample
                v-model:range="budget"
                @change-end="(values: number[]) => (settledBudget = values.join('–'))"
            />
        </template>

        <template #vertical>
            <VerticalExample v-model:value="vertical" v-model:range="verticalPair" />
        </template>

        <template #knob>
            <KnobExample v-model:value="knob" />
        </template>

        <template #disabled>
            <DisabledExample v-model:value="disabled" />
        </template>

        <template #disabledPair>
            <DisabledPairExample v-model:range="disabledPair" />
        </template>

        <template #reachable>
            <ReachableExample v-model:value="reachable" />
        </template>

        <template #errored>
            <ErroredExample v-model:value="errored" />
        </template>
    </PageExamples>
</template>
