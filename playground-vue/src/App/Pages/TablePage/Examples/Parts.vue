<script setup lang="ts">
import { useModel } from "vue";

import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

const props = defineProps<TableExampleProps>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");

const columns = createPartColumns({ isResizable: false });
</script>

<template>
    <div :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            :columns="columns"
            :rows="PARTS"
            ariaLabel="Parts"
        />
    </div>
</template>
