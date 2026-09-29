<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import NestedExample from "./Examples/Nested.vue";
import SectionsExample from "./Examples/Sections.vue";

const EXAMPLES_ROOT = "/src/App/Pages/FormSectionPage/Examples";

const email = shallowRef("");
const password = shallowRef("");
const confirm = shallowRef("");

const street = shallowRef("");
const card = shallowRef("");

const outcome = shallowRef("not submitted");
const nestedOutcome = shallowRef("not submitted");

const submit = () => {
    outcome.value = `submitted as ${email.value}`;
};

const reset = () => {
    outcome.value = "not submitted";
};

const examples: ExampleDefs[] = [
    {
        key: "sections",
        name: "Sections with their own validity",
        readout: () =>
            `outcome: ${outcome.value} — each field reports to its own section, and the form hears one answer per section rather than one per field`,
        path: `${EXAMPLES_ROOT}/Sections.vue`,
    },
    {
        key: "nested",
        name: "A section inside a section",
        readout: () =>
            `outcome: ${nestedOutcome.value} — the payment section answers to the delivery section, which answers to the form, so the verdict travels up two levels rather than one`,
        path: `${EXAMPLES_ROOT}/Nested.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #sections>
            <SectionsExample
                v-model:email="email"
                v-model:password="password"
                v-model:confirm="confirm"
                @submit="submit"
                @reset="reset"
            />
        </template>

        <template #nested>
            <NestedExample v-model:street="street" v-model:card="card" @submit="nestedOutcome = 'submitted'" />
        </template>
    </PageExamples>
</template>
