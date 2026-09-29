<script setup lang="ts">
import { shallowRef } from "vue";

import {
    AMOUNT_STEP,
    GERMAN_LOCALE,
    QUANTITY_MIN,
    QUANTITY_STEP,
    RATING_STEP,
} from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import FractionalStepExample from "./Examples/FractionalStep.vue";
import GermanExample from "./Examples/German.vue";
import LabeledExample from "./Examples/Labeled.vue";
import ReachableExample from "./Examples/Reachable.vue";
import ReadOnlyExample from "./Examples/ReadOnly.vue";
import SteppedClampedExample from "./Examples/SteppedClamped.vue";
import UnitExample from "./Examples/Unit.vue";

const EXAMPLES_ROOT = "/src/App/Pages/NumberInputPage/Examples";

const defaultValue = shallowRef<number | undefined>(undefined);
const quantity = shallowRef<number | undefined>(13);
const rating = shallowRef<number | undefined>(3.7);
const german = shallowRef<number | undefined>(1234.5);
const unit = shallowRef<number | undefined>(72);
const readOnly = shallowRef<number | undefined>(1024);
const disabled = shallowRef<number | undefined>(7);
const reachable = shallowRef<number | undefined>(7);
const errored = shallowRef<number | undefined>(0);
const labeled = shallowRef<number | undefined>(undefined);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${defaultValue.value} — an empty field has no value at all`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "steppedClamped",
        name: "Stepped and clamped",
        readout: () =>
            `value: ${quantity.value} — steps of ${QUANTITY_STEP} counted from ${QUANTITY_MIN}; an out-of-range value is held back until the field is left`,
        path: `${EXAMPLES_ROOT}/SteppedClamped.vue`,
    },
    {
        key: "fractionalStep",
        name: "Fractional step",
        readout: () => `value: ${rating.value} — a step of ${RATING_STEP} must not drift`,
        path: `${EXAMPLES_ROOT}/FractionalStep.vue`,
    },
    {
        key: "german",
        name: "German conventions",
        readout: () =>
            `value: ${german.value} — under ${GERMAN_LOCALE} "1.000" is one thousand and "1,5" is one and a half; PageUp and PageDown move ${AMOUNT_STEP * 10}, ten steps`,
        path: `${EXAMPLES_ROOT}/German.vue`,
    },
    {
        key: "unit",
        name: "With a unit",
        readout: () => `value: ${unit.value} — one slot holds both the unit and the stepper`,
        path: `${EXAMPLES_ROOT}/Unit.vue`,
    },
    {
        key: "readOnly",
        name: "Read-only",
        readout: () => `value: ${readOnly.value} — the stepper is refused along with the keyboard`,
        path: `${EXAMPLES_ROOT}/ReadOnly.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `value: ${disabled.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
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
        readout: () => `value: ${errored.value} — anything but a positive count is an error`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
    {
        key: "label",
        name: "In a Label",
        readout: () => `value: ${labeled.value}`,
        path: `${EXAMPLES_ROOT}/Labeled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="defaultValue" />
        </template>

        <template #steppedClamped>
            <SteppedClampedExample v-model:value="quantity" />
        </template>

        <template #fractionalStep>
            <FractionalStepExample v-model:value="rating" />
        </template>

        <template #german>
            <GermanExample v-model:value="german" />
        </template>

        <template #unit>
            <UnitExample v-model:value="unit" />
        </template>

        <template #readOnly>
            <ReadOnlyExample v-model:value="readOnly" />
        </template>

        <template #disabled>
            <DisabledExample v-model:value="disabled" />
        </template>

        <template #reachable>
            <ReachableExample v-model:value="reachable" />
        </template>

        <template #errored>
            <ErroredExample v-model:value="errored" />
        </template>

        <template #label>
            <LabeledExample v-model:value="labeled" />
        </template>
    </PageExamples>
</template>
