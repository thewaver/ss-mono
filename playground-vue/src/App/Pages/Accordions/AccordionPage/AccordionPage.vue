<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import DeferredExample from "./Examples/Deferred.vue";
import GrowingExample from "./Examples/Growing.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import SectionsExample from "./Examples/Sections.vue";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/AccordionPage/Examples";

const STARTING_EXTRA_LINES = 0;

const multi = shallowRef<string[]>(["Shipping"]);
const single = shallowRef<string[]>([]);
const required = shallowRef<string[]>(["Shipping"]);
const growing = shallowRef<string[]>(["Shipping"]);
const scrolled = shallowRef<string[]>([]);
const deferred = shallowRef<string[]>([]);

const extraLines = shallowRef(STARTING_EXTRA_LINES);
const built = shallowRef<string[]>([]);

const build = (value: string) => {
    if (built.value.includes(value)) return;

    built.value = [...built.value, value];
};

const examples: ExampleDefs[] = [
    {
        key: "multi",
        name: "Many open at once",
        readout: () => `expanded: ${JSON.stringify(multi.value)}`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "unheld",
        name: "Nobody holding the state",
        readout: () =>
            "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "single",
        name: "One at a time",
        readout: () => `expanded: ${JSON.stringify(single.value)} — the component keeps at most one`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "required",
        name: "One at a time, and always one",
        readout: () =>
            `expanded: ${JSON.stringify(required.value)} — pressing the open header does nothing, because the only way out of a section is into another one`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "growing",
        name: "Content that grows while open",
        readout: () => `extra lines: ${extraLines.value} — the panel follows its content without reopening`,
        path: `${EXAMPLES_ROOT}/Growing.vue`,
    },
    {
        key: "deferred",
        name: "Panels built on first open",
        readout: () =>
            `built: ${JSON.stringify(built.value)} — a section's content is not in the page until it is opened once, and stays there afterwards`,
        path: `${EXAMPLES_ROOT}/Deferred.vue`,
    },
    {
        key: "scrolled",
        name: "Inside a box that scrolls",
        readout: () => `expanded: ${JSON.stringify(scrolled.value)} — opening a section below the fold brings it up`,
        path: `${EXAMPLES_ROOT}/Scrolled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #multi>
            <SectionsExample v-model:expanded="multi" />
        </template>

        <template #unheld>
            <SectionsExample />
        </template>

        <template #single>
            <SectionsExample v-model:expanded="single" is-single-expand />
        </template>

        <template #required>
            <SectionsExample v-model:expanded="required" is-single-expand is-expand-required />
        </template>

        <template #growing>
            <GrowingExample v-model:expanded="growing" :extra-lines="extraLines" @add-line="extraLines++" />
        </template>

        <template #deferred>
            <DeferredExample v-model:expanded="deferred" @build="build" />
        </template>

        <template #scrolled>
            <ScrolledExample v-model:expanded="scrolled" />
        </template>
    </PageExamples>
</template>
