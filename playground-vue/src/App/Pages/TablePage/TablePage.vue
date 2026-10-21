<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import ConsumerSortedExample from "./Examples/ConsumerSorted.vue";
import DisabledExample from "./Examples/Disabled.vue";
import PartsExample from "./Examples/Parts.vue";
import ReorderableExample from "./Examples/Reorderable.vue";
import ResizableExample from "./Examples/Resizable.vue";
import RightToLeftExample from "./Examples/RightToLeft.vue";
import SingleSelectionExample from "./Examples/SingleSelection.vue";
import VirtualizedExample from "./Examples/Virtualized.vue";
import type { Part } from "./TablePage.types";
import { STRESS_PART_COUNT, createStressParts } from "./TablePageVue.const";

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

const rightToLeftSort = shallowRef<TableSort | undefined>();
const rightToLeftSelection = shallowRef<Part[]>([]);
const rightToLeftWidths = shallowRef<Record<string, number>>({});
const rightToLeftOrder = shallowRef<string[]>([]);

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
        name: EXAMPLE_NAMES.default,
        readout: () =>
            `sort: ${spellSort(defaultSort.value)} | selected: ${spellSelection(defaultSelection.value)} — one tab stop for the whole grid, then arrows walk cell to cell and Space picks a row`,
        path: `${EXAMPLES_ROOT}/Parts.vue`,
    },
    {
        key: "singleSelection",
        name: EXAMPLE_NAMES.singleSelection,
        readout: () =>
            `selected: ${spellSelection(singleSelection.value)} — the same grid with room for one row in the selection, so picking a second drops the first`,
        path: `${EXAMPLES_ROOT}/SingleSelection.vue`,
    },
    {
        key: "resizable",
        span: 2,
        name: EXAMPLE_NAMES.resizable,
        readout: () =>
            `widths: ${JSON.stringify(resizableWidths.value)} — drag a column's right edge, or focus a header cell and hold Ctrl with the left and right arrows`,
        path: `${EXAMPLES_ROOT}/Resizable.vue`,
    },
    {
        key: "reorderable",
        span: 2,
        name: EXAMPLE_NAMES.reorderable,
        readout: () =>
            `order: ${reorderableOrder.value.join(", ") || "as declared"} — drag a header sideways, or focus a header cell and hold Shift with the left and right arrows`,
        path: `${EXAMPLES_ROOT}/Reorderable.vue`,
    },
    {
        key: "rightToLeft",
        span: 2,
        name: EXAMPLE_NAMES.rightToLeft,
        readout: () =>
            `widths: ${JSON.stringify(rightToLeftWidths.value)} | order: ${rightToLeftOrder.value.join(", ") || "as declared"} — the box around the table sets dir="rtl", so the columns run from the right, a column's resize edge is on its left, and the arrows swap meaning`,
        path: `${EXAMPLES_ROOT}/RightToLeft.vue`,
    },
    {
        key: "consumerSorted",
        name: EXAMPLE_NAMES.consumerSorted,
        readout: () =>
            `sort: ${spellSort(consumerSort.value)} — no column carries a comparator, so the table reports the sort and the page is what reorders the rows`,
        path: `${EXAMPLES_ROOT}/ConsumerSorted.vue`,
    },
    {
        key: "virtualized",
        span: 2,
        name: EXAMPLE_NAMES.virtualized,
        readout: () =>
            `${STRESS_PART_COUNT.toLocaleString("en-GB")} rows, ${stressSelection.value.length} selected | sort: ${spellSort(stressSort.value)} — the header stays put, and only the rows on screen exist`,
        path: `${EXAMPLES_ROOT}/Virtualized.vue`,
    },
    {
        key: "disabled",
        name: EXAMPLE_NAMES.disabled,
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

        <template #rightToLeft>
            <RightToLeftExample
                v-model:sort="rightToLeftSort"
                v-model:selection="rightToLeftSelection"
                v-model:widths="rightToLeftWidths"
                v-model:order="rightToLeftOrder"
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
