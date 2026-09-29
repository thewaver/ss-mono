<script setup lang="ts">
import { useModel } from "vue";

import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.vue";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

type Props = TableExampleProps & {
    "widths": Record<string, number>;
    "onUpdate:widths"?: (widths: Record<string, number>) => void;
};

const props = defineProps<Props>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");
const widths = useModel(props, "widths");

const columns = createPartColumns({ isResizable: true });
</script>

<template>
    <div :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            v-model:widths="widths"
            :columns="columns"
            :rows="PARTS"
            ariaLabel="Parts with resizable columns"
        >
            <template #renderResizer="renderProps">
                <PageTableResizer :render-props="renderProps" />
            </template>
        </Table>
    </div>
</template>
