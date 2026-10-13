<script setup lang="ts">
import { shallowRef } from "vue";

import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import FocusOnErrorExample from "./Examples/FocusOnError.vue";
import SignUpExample from "./Examples/SignUp.vue";

const email = shallowRef("");
const password = shallowRef("");
const terms = shallowRef(false);

const outcome = shallowRef("not submitted");

const plan = shallowRef<string | undefined>();
const topics = shallowRef<string[]>([]);

const focusOutcome = shallowRef("not submitted");

const submit = () => {
    outcome.value = `submitted as ${email.value}`;
};

const reset = () => {
    outcome.value = "not submitted";
};

const submitFocus = () => {
    focusOutcome.value = `submitted as ${plan.value ?? "no plan"}, [${topics.value.join(", ")}]`;
};

const resetFocus = () => {
    plan.value = undefined;
    topics.value = [];
    focusOutcome.value = "not submitted";
};

const examples: ExampleDefs[] = [
    {
        key: "reportsValidity",
        name: EXAMPLE_NAMES.reportsValidity,
        readout: () => `outcome: ${outcome.value}`,
        path: `${EXAMPLES_ROOT}/SignUp.vue`,
    },
    {
        key: "focusOnError",
        name: EXAMPLE_NAMES.focusOnError,
        readout: () =>
            `outcome: ${focusOutcome.value} — the handler runs either way, and afterwards focus lands on the first field reporting an error`,
        path: `${EXAMPLES_ROOT}/FocusOnError.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #reportsValidity>
            <SignUpExample
                v-model:email="email"
                v-model:password="password"
                v-model:terms="terms"
                @submit="submit"
                @reset="reset"
            />
        </template>

        <template #focusOnError>
            <FocusOnErrorExample
                v-model:plan="plan"
                v-model:topics="topics"
                @submit="submitFocus"
                @reset="resetFocus"
            />
        </template>
    </PageExamples>
</template>
