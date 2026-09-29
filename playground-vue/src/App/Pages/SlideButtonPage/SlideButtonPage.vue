<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import DescribedExample from "./Examples/Described.vue";
import DisabledExample from "./Examples/Disabled.vue";
import ErroredExample from "./Examples/Errored.vue";
import HeldExample from "./Examples/Held.vue";
import HoldOnlyExample from "./Examples/HoldOnly.vue";
import ReachableExample from "./Examples/Reachable.vue";
import SlideOnlyExample from "./Examples/SlideOnly.vue";

const EXAMPLES_ROOT = "/src/App/Pages/SlideButtonPage/Examples";
const PERCENT = 100;

const sends = shallowRef(0);
const progress = shallowRef(0);
const isArmed = shallowRef(false);
const describedSends = shallowRef(0);
const disabledSends = shallowRef(0);
const reachableSends = shallowRef(0);
const hasError = shallowRef(true);
const slideOnlySends = shallowRef(0);
const holdOnlySends = shallowRef(0);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () =>
            `activations: ${sends.value} — progress ${Math.round(progress.value * PERCENT)}%, which the owner reads while the gesture is still running`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "described",
        name: "Described by its field",
        readout: () =>
            `activations: ${describedSends.value} — the hint under the control is what a screen reader reads after its name, so the gesture is stated before anyone has to guess it`,
        path: `${EXAMPLES_ROOT}/Described.vue`,
    },
    {
        key: "slideOnly",
        name: "Slide only",
        readout: () =>
            `activations: ${slideOnlySends.value} — a held press does nothing here, so carrying the thumb is the only pointer route, and a held Enter still confirms`,
        path: `${EXAMPLES_ROOT}/SlideOnly.vue`,
    },
    {
        key: "holdOnly",
        name: "Hold only",
        readout: () =>
            `activations: ${holdOnlySends.value} — dragging the thumb does nothing here, so a stray drag cannot reach the action, and a held press or a held Enter both can`,
        path: `${EXAMPLES_ROOT}/HoldOnly.vue`,
    },
    {
        key: "held",
        name: "Held at the end by the owner",
        readout: () => `armed: ${isArmed.value}`,
        path: `${EXAMPLES_ROOT}/Held.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => `activations: ${disabledSends.value}`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
    {
        key: "reachable",
        name: "Disabled + reachable",
        readout: () => `activations: ${reachableSends.value}`,
        path: `${EXAMPLES_ROOT}/Reachable.vue`,
    },
    {
        key: "errored",
        name: "Error",
        readout: () => `hasError: ${hasError.value}`,
        path: `${EXAMPLES_ROOT}/Errored.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:progress="progress" @activate="sends++" />
        </template>

        <template #described>
            <DescribedExample @activate="describedSends++" />
        </template>

        <template #slideOnly>
            <SlideOnlyExample @activate="slideOnlySends++" />
        </template>

        <template #holdOnly>
            <HoldOnlyExample @activate="holdOnlySends++" />
        </template>

        <template #held>
            <HeldExample :is-armed="isArmed" @activate="isArmed = true" @reset="isArmed = false" />
        </template>

        <template #disabled>
            <DisabledExample @activate="disabledSends++" />
        </template>

        <template #reachable>
            <ReachableExample @activate="reachableSends++" />
        </template>

        <template #errored>
            <ErroredExample :has-error="hasError" @activate="hasError = !hasError" />
        </template>
    </PageExamples>
</template>
