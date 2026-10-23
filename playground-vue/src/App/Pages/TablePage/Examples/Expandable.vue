<script setup lang="ts">
import { useModel } from "vue";

import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import PageTableDetailContent from "../../../StyledComponents/TableContent/PageTableDetailContent.vue";
import type { Part, TableExampleProps } from "../TablePage.types";
import { PARTS, createPartColumns, formatPrice } from "../TablePageVue.const";

const ESTIMATED_ROW_HEIGHT = 33;

type Props = TableExampleProps & {
    "expanded": Part[];
    "onUpdate:expanded"?: (rows: Part[]) => void;
};

const props = defineProps<Props>();

const sort = useModel(props, "sort");
const selection = useModel(props, "selection");
const expanded = useModel(props, "expanded");

const columns = createPartColumns({ isExpandable: true });

const computeIsExpandable = (part: Part) => part.stock > 0;

const computeEstimatedRowHeight = () => ESTIMATED_ROW_HEIGHT;
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
            :compute-is-expandable="computeIsExpandable"
            :compute-estimated-row-height="computeEstimatedRowHeight"
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
