<script setup lang="ts">
import { shallowRef } from "vue";

import type { TableSort } from "@thewaver/ss-components-vue";
import { Table } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

import { PARTS, createPartColumns } from "../TablePageVue.const";
import type { Part, TableBasicDocsExampleProps } from "../TablePageVue.types";

type Props = TableBasicDocsExampleProps;

defineProps<Props>();

const sort = shallowRef<TableSort | undefined>();
const selection = shallowRef<Part[]>([]);

const columns = createPartColumns({});
</script>

<template>
    <div :class="styles.tableFrameShort">
        <Table
            v-model:sort="sort"
            v-model:selection="selection"
            :columns="columns"
            :rows="PARTS"
            :selection-mode="selectionMode"
            :is-disabled="isDisabled"
            ariaLabel="Parts"
        />
    </div>
</template>
