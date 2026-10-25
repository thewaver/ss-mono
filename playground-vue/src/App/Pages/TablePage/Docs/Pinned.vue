<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { Table } from "@thewaver/ss-components-vue";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.vue";
import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.vue";
import { PARTS, createPartColumns } from "../TablePageVue.const";
import type { Part } from "../TablePageVue.types";

const sort = shallowRef<TableSort | undefined>();
const selection = shallowRef<Part[]>([]);
const widths = shallowRef<Record<string, number>>({});
const order = shallowRef<string[]>([]);

const columns = createPartColumns({ isPinned: true, isResizable: true, isReorderable: true });
</script>

<template>
    <div :class="styles.tableFrameCapped">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            v-model:widths="widths"
            v-model:order="order"
            :columns="columns"
            :rows="PARTS"
            ariaLabel="Parts with pinned columns"
            :announcements="TABLE_ANNOUNCEMENTS"
        >
            <template #renderResizer="renderProps">
                <PageTableResizer :render-props="renderProps" />
            </template>

            <template #renderMarker>
                <PageTableMarker />
            </template>
        </Table>
    </div>
</template>
