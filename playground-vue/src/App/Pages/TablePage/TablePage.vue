<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import ConsumerSortedExample from "./Examples/ConsumerSorted.vue";
import DisabledExample from "./Examples/Disabled.vue";
import PartsExample from "./Examples/Parts.vue";
import ReorderableExample from "./Examples/Reorderable.vue";
import ResizableExample from "./Examples/Resizable.vue";
import SingleSelectionExample from "./Examples/SingleSelection.vue";
import VirtualizedExample from "./Examples/Virtualized.vue";
import { STRESS_PART_COUNT, createStressParts } from "./TablePage.const";
import type { Part } from "./TablePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TablePage/Examples";

const spellSort = (sort: TableSort | undefined) =>
    sort === undefined ? "unsorted" : `${sort.columnId} ${sort.direction}`;

const spellSelection = (parts: Part[]) => (parts.length < 1 ? "nothing" : parts.map((part) => part.sku).join(", "));

const defaultSort = shallowRef<TableSort | undefined>();
const defaultSelection = shallowRef<Part[]>([]);

const singleSort = shallowRef<TableSort | undefined>();
const singleSelection = shallowRef<Part[]>([]);

const resizableSort = shallowRef<TableSort | undefined>();
const resizableSelection = shallowRef<Part[]>([]);
const resizableWidths = shallowRef<Record<string, number>>({});

const reorderableSort = shallowRef<TableSort | undefined>();
const reorderableSelection = shallowRef<Part[]>([]);
const reorderableOrder = shallowRef<string[]>([]);

const consumerSort = shallowRef<TableSort | undefined>();
const consumerSelection = shallowRef<Part[]>([]);

const stressSort = shallowRef<TableSort | undefined>();
const stressSelection = shallowRef<Part[]>([]);
const stressParts = createStressParts();

const disabledSort = shallowRef<TableSort | undefined>();
const disabledSelection = shallowRef<Part[]>([]);

const examples: ExampleDefs[] = [
    {
        key: "default",
        span: 2,
        name: "Default",
        readout: () =>
            `sort: ${spellSort(defaultSort.value)} | selected: ${spellSelection(defaultSelection.value)} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
        path: `${EXAMPLES_ROOT}/Parts.vue`,
    },
    {
        key: "singleSelection",
        name: "One row at a time",
        readout: () =>
            `selected: ${spellSelection(singleSelection.value)} — the same grid with room for one row in the selection, so picking a second drops the first`,
        path: `${EXAMPLES_ROOT}/SingleSelection.vue`,
    },
    {
        key: "resizable",
        span: 2,
        name: "Resizable columns",
        readout: () =>
            `widths: ${JSON.stringify(resizableWidths.value)} — drag a column's right edge, or focus a header cell and hold Ctrl with the left and right arrows`,
        path: `${EXAMPLES_ROOT}/Resizable.vue`,
    },
    {
        key: "reorderable",
        span: 2,
        name: "Reorderable columns",
        readout: () =>
            `order: ${reorderableOrder.value.join(", ") || "as declared"} — drag a header sideways, or focus a header cell and hold Shift with the left and right arrows`,
        path: `${EXAMPLES_ROOT}/Reorderable.vue`,
    },
    {
        key: "consumerSorted",
        name: "Sorted by the page",
        readout: () =>
            `sort: ${spellSort(consumerSort.value)} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
        path: `${EXAMPLES_ROOT}/ConsumerSorted.vue`,
    },
    {
        key: "virtualized",
        span: 2,
        name: "Virtualized",
        readout: () =>
            `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelection.value.length} selected | sort: ${spellSort(stressSort.value)} — the header stays put, and only the rows on screen exist`,
        path: `${EXAMPLES_ROOT}/Virtualized.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () =>
            `sort: ${spellSort(disabledSort.value)} — nothing sorts, nothing selects, and every cell still reads out to a screen reader`,
        path: `${EXAMPLES_ROOT}/Disabled.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples">
        <template #default>
            <PartsExample v-model:sort="defaultSort" v-model:selection="defaultSelection" />
        </template>

        <template #singleSelection>
            <SingleSelectionExample v-model:sort="singleSort" v-model:selection="singleSelection" />
        </template>

        <template #resizable>
            <ResizableExample
                v-model:sort="resizableSort"
                v-model:selection="resizableSelection"
                v-model:widths="resizableWidths"
            />
        </template>

        <template #reorderable>
            <ReorderableExample
                v-model:sort="reorderableSort"
                v-model:selection="reorderableSelection"
                v-model:order="reorderableOrder"
            />
        </template>

        <template #consumerSorted>
            <ConsumerSortedExample v-model:sort="consumerSort" v-model:selection="consumerSelection" />
        </template>

        <template #virtualized>
            <VirtualizedExample v-model:sort="stressSort" v-model:selection="stressSelection" :rows="stressParts" />
        </template>

        <template #disabled>
            <DisabledExample v-model:sort="disabledSort" v-model:selection="disabledSelection" />
        </template>
    </PageExamples>
</template>
