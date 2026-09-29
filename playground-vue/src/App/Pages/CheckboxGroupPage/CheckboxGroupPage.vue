<script setup lang="ts">
import { shallowRef } from "vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import DefaultExample from "./Examples/Default.vue";
import SelectAllExample from "./Examples/SelectAll.vue";

const EXAMPLES_ROOT = "/src/App/Pages/CheckboxGroupPage/Examples";

const describe = (values: string[]) => (values.length > 0 ? values.join(", ") : "none");

const defaultValue = shallowRef<string[]>(["cheese"]);
const selectAllValue = shallowRef<string[]>(["cheese", "olives"]);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Default",
        readout: () => `value: ${describe(defaultValue.value)} — one list, and each box is its own tab stop`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "selectAll",
        name: "With a select-all box",
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
