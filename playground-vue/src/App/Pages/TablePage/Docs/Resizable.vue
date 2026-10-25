<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.vue";
import { PARTS, createPartColumns } from "../TablePageVue.const";
import type { Part } from "../TablePageVue.types";

const sort = shallowRef<TableSort | undefined>();
const selection = shallowRef<Part[]>([]);
const widths = shallowRef<Record<string, number>>({});

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
