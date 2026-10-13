<script setup lang="ts">
import { shallowRef } from "vue";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import SelectAllExample from "./Examples/SelectAll.vue";

const describe = (values: string[]) => (values.length > 0 ? values.join(", ") : "none");

const defaultValue = shallowRef<string[]>(["cheese"]);
const selectAllValue = shallowRef<string[]>(["cheese", "olives"]);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () => `value: ${describe(defaultValue.value)} — one list, and each box is its own tab stop`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "selectAll",
        name: EXAMPLE_NAMES.selectAll,
        readout: () =>
            `value: ${describe(selectAllValue.value)} — the top box reads mixed while the toppings disagree, and pressing it ticks or clears every one still on sale`,
        path: `${EXAMPLES_ROOT}/SelectAll.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-model:value="defaultValue" />
        </template>

        <template #selectAll>
            <SelectAllExample v-model:value="selectAllValue" />
        </template>
    </PageExamples>
</template>
