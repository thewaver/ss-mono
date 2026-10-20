<script setup lang="ts">
import { shallowRef } from "vue";

import { EXAMPLES_ROOT, EXAMPLE_NAMES, STEP_COUNT } from "@thewaver/ss-playground/App/Pages/RangePage/RangePage.const";
import type { Span } from "@thewaver/ss-utils";

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

const volume = shallowRef(40);
const steps = shallowRef(3);
const vertical = shallowRef(60);
const disabled = shallowRef(25);
const reachable = shallowRef(75);
const errored = shallowRef(90);
const knob = shallowRef(30);

const price = shallowRef<Span>({ start: 20, end: 80 });
const budget = shallowRef<Span>({ start: 100, end: 350 });
const settledBudget = shallowRef("not yet");
const verticalPair = shallowRef<Span>({ start: 30, end: 70 });
const disabledPair = shallowRef<Span>({ start: 35, end: 65 });

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () => `value: ${volume.value}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "stepped",
        name: EXAMPLE_NAMES.stepped,
        readout: () => `value: ${steps.value} of ${STEP_COUNT}`,
        path: `${EXAMPLES_ROOT}/Stepped.vue`,
    },
    {
        key: "pair",
        name: EXAMPLE_NAMES.pair,
        readout: () => `start: ${price.value.start} | end: ${price.value.end}`,
        path: `${EXAMPLES_ROOT}/Pair.vue`,
    },
    {
        key: "priceRange",
        name: EXAMPLE_NAMES.priceRange,
        readout: () =>
            `start: ${budget.value.start} | end: ${budget.value.end} | settled: ${settledBudget.value} — each thumb reads its value as a price, and "settled" changes only when a drag lets go or a key is pressed`,
        path: `${EXAMPLES_ROOT}/Price.vue`,
    },
    {
        key: "vertical",
        name: EXAMPLE_NAMES.vertical,
        readout: () => `single: ${vertical.value} | pair: ${verticalPair.value.start}–${verticalPair.value.end}`,
        path: `${EXAMPLES_ROOT}/Vertical.vue`,
    },
    {
        key: "knob",
        name: EXAMPLE_NAMES.knob,
        readout: () =>
            `value: ${knob.value} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
        path: `${EXAMPLES_ROOT}/Knob.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
        readout: () => `value: ${disabled.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "disabledPair",
        name: EXAMPLE_NAMES.disabledPair,
        readout: () =>
            `start: ${disabledPair.value.start} | end: ${disabledPair.value.end} — both thumbs must be out of the tab order`,
        path: `${EXAMPLES_ROOT}/DisabledPair.vue`,
    },
    {
        key: "reachable",
        name: EXAMPLE_NAMES.reachable,
        readout: () => `value: ${reachable.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: EXAMPLE_NAMES.errored,
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
