<script setup lang="ts">
import { useModel } from "vue";

import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { createPartColumns } from "../TablePage.const";
import type { Part, TableExampleProps } from "../TablePage.types";

const ESTIMATED_ROW_HEIGHT = 29;

type Props = TableExampleProps & { rows: Part[] };

const props = defineProps<Props>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");

const columns = createPartColumns({ isResizable: false });

const computeEstimatedRowHeight = () => ESTIMATED_ROW_HEIGHT;
</script>

<template>
    <div :class="styles.tableFrameTall">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            :columns="columns"
            :rows="rows"
            ariaLabel="Every part"
            :compute-estimated-row-height="computeEstimatedRowHeight"
        />
    </div>
</template>
