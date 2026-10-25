<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableDetailContent from "../../../StyledComponents/TableContent/PageTableDetailContent.vue";
import { PARTS, createPartColumns, formatPrice } from "../TablePageVue.const";
import type { Part } from "../TablePageVue.types";

const ESTIMATED_ROW_HEIGHT = 33;

const sort = shallowRef<TableSort | undefined>();
const selection = shallowRef<Part[]>([]);
const expanded = shallowRef<Part[]>([]);

const columns = createPartColumns({ isExpandable: true });
</script>

<template>
    <div :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            v-model:expanded="expanded"
            :columns="columns"
            :rows="PARTS"
            ariaLabel="Parts with details"
            :compute-is-expandable="(part: Part) => part.stock > 0"
            :compute-estimated-row-height="() => ESTIMATED_ROW_HEIGHT"
        >
            <template #renderDetail="{ row, renderProps }">
                <PageTableDetailContent :render-props="renderProps">
                    {{
                        `${row.name}, filed under ${row.category}: ${row.stock.toLocaleString("en-GB")} on the shelf at ${formatPrice(row.pricePence)} each, ${formatPrice(row.stock * row.pricePence)} held in all.`
                    }}
                </PageTableDetailContent>
            </template>
        </Table>
    </div>
</template>
