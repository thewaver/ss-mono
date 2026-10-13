<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SelectUtils } from "@thewaver/ss-components-vue";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import { GROUPED_COUNTRIES } from "../SelectPage/SelectPageVue.const";
import MultiSelectClearableExample from "./Examples/MultiSelectClearable.vue";
import MultiSelectCountriesExample from "./Examples/MultiSelectCountries.vue";
import MultiSelectGroupedExample from "./Examples/MultiSelectGrouped.vue";

const countries = shallowRef<string[]>(["Denmark"]);
const grouped = shallowRef<string[]>([]);
const query = shallowRef("");
const clearable = shallowRef<string[]>(["Belgium", "Sweden"]);
const clearableChange = shallowRef("none yet");

const filteredGroups = computed(() => {
    const needle = query.value.toLocaleLowerCase();

    if (!needle) return GROUPED_COUNTRIES;

    return GROUPED_COUNTRIES.map((item) =>
        SelectUtils.getIsGroup(item)
            ? {
                  ...item,
                  options: item.options.filter((option) => option.value.toLocaleLowerCase().includes(needle)),
              }
            : item,
    ).filter((item) =>
        SelectUtils.getIsGroup(item) ? item.options.length > 0 : item.value.toLocaleLowerCase().includes(needle),
    );
});

const examples: ExampleDefs[] = [
    {
        key: "multiSelect",
        name: EXAMPLE_NAMES.multiSelect,
        readout: () => `values: [${countries.value.join(", ")}] — picking keeps the list open`,
        path: `${EXAMPLES_ROOT}/MultiSelectCountries.vue`,
    },
    {
        key: "multiSelectGrouped",
        name: EXAMPLE_NAMES.multiSelectGrouped,
        readout: () =>
            `values: [${grouped.value.join(", ")}] | query: "${query.value}" — the page drops groups it has emptied`,
        path: `${EXAMPLES_ROOT}/MultiSelectGrouped.vue`,
    },
    {
        key: "multiSelectClearable",
        name: EXAMPLE_NAMES.multiSelectClearable,
        readout: () =>
            `values: [${clearable.value.join(", ")}] | last change: ${clearableChange.value} — the clear control empties every pick at once`,
        path: `${EXAMPLES_ROOT}/MultiSelectClearable.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #multiSelect>
            <MultiSelectCountriesExample v-model:values="countries" />
        </template>

        <template #multiSelectGrouped>
            <MultiSelectGroupedExample v-model:values="grouped" v-model:query="query" :options="filteredGroups" />
        </template>

        <template #multiSelectClearable>
            <MultiSelectClearableExample
                v-model:values="clearable"
                @selection-change="(values: string[]) => (clearableChange = `[${values.join(', ')}]`)"
            />
        </template>
    </PageExamples>
</template>
