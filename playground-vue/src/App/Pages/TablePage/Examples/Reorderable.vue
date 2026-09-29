<script setup lang="ts">
import { useModel } from "vue";

import { Table } from "@thewaver/ss-components-vue";
import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.vue";
import { PARTS, createPartColumns } from "../TablePage.const";
import type { TableExampleProps } from "../TablePage.types";

type Props = TableExampleProps & {
    "order": string[];
    "onUpdate:order"?: (order: string[]) => void;
};

const props = defineProps<Props>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");
const order = useModel(props, "order");

const columns = createPartColumns({ isReorderable: true });
</script>

<template>
    <div :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            v-model:order="order"
            :columns="columns"
            :rows="PARTS"
            ariaLabel="Parts with reorderable columns"
            :announcements="TABLE_ANNOUNCEMENTS"
        >
            <template #renderMarker>
                <PageTableMarker />
            </template>
        </Table>
    </div>
</template>
