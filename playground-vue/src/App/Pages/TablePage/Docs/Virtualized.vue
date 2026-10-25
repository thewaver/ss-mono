<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { createPartColumns, createStressParts } from "../TablePageVue.const";
import type { Part, TableVirtualizedDocsExampleProps } from "../TablePageVue.types";

const ESTIMATED_ROW_HEIGHT = 29;

type Props = TableVirtualizedDocsExampleProps;

const props = defineProps<Props>();

const sort = shallowRef<TableSort | undefined>();
const selection = shallowRef<Part[]>([]);

const columns = createPartColumns({});
const rows = computed(() => createStressParts(props.count));
</script>

<template>
    <div :class="styles.tableFrameTall">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            :columns="columns"
            :rows="rows"
            ariaLabel="Every part"
            :compute-estimated-row-height="() => ESTIMATED_ROW_HEIGHT"
        />
    </div>
</template>
