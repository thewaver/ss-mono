<script setup lang="ts">
import { h, shallowRef, useModel } from "vue";

import type { TableColumn, TableSort } from "@thewaver/ss-components-vue";
import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableHeader from "../../../PageComponents/TableHeader/TableHeader.vue";
import PageTableCellContent from "../../../StyledComponents/TableContent/PageTableCellContent.vue";
import { PARTS } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

const COMPARATORS: Record<string, (a: Part, b: Part) => number> = {
    sku: (a, b) => a.sku.localeCompare(b.sku),
    name: (a, b) => a.name.localeCompare(b.name),
};

const COLUMNS: TableColumn<Part>[] = [
    {
        id: "sku",
        header: "SKU",
        widthPx: 110,
        isSortable: true,
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps }, () => "SKU"),
        renderCell: ({ row, renderProps }) => h(PageTableCellContent, { renderProps }, () => row.sku),
    },
    {
        id: "name",
        header: "Name",
        minWidthPx: 140,
        isSortable: true,
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps }, () => "Name"),
        renderCell: ({ row, renderProps }) => h(PageTableCellContent, { renderProps }, () => row.name),
    },
    {
        id: "category",
        header: "Category",
        widthPx: 140,
        renderHeader: (renderProps) => h(PageTableHeader, { renderProps }, () => "Category"),
        renderCell: ({ row, renderProps }) => h(PageTableCellContent, { renderProps }, () => row.category),
    },
];

const props = defineProps<TableExampleProps>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");

const rows = shallowRef<Part[]>(PARTS);

const reorder = (next: TableSort | undefined) => {
    if (next === undefined) {
        rows.value = PARTS;

        return;
    }

    const sign = next.direction === "ascending" ? 1 : -1;

    rows.value = [...rows.value].sort((a, b) => sign * COMPARATORS[next.columnId](a, b));
};
</script>

<template>
    <div :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            :columns="COLUMNS"
            :rows="rows"
            ariaLabel="Parts sorted by the page"
            @sort-change="reorder"
        />
    </div>
</template>
