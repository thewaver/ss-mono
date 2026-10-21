<script setup lang="ts">
import { useModel } from "vue";

import { Table } from "@thewaver/ss-components-vue";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.vue";
import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.vue";
import type { TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns } from "../TablePageVue.const";

type Props = TableExampleProps & {
    "widths": Record<string, number>;
    "onUpdate:widths"?: (widths: Record<string, number>) => void;
    "order": string[];
    "onUpdate:order"?: (order: string[]) => void;
};

const props = defineProps<Props>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");
const widths = useModel(props, "widths");
const order = useModel(props, "order");

const columns = createPartColumns({ isResizable: true, isReorderable: true });
</script>

<template>
    <div dir="rtl" :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            v-model:widths="widths"
            v-model:order="order"
            :columns="columns"
            :rows="PARTS"
            ariaLabel="Parts in a right-to-left box"
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
