<script setup lang="ts">
import { TableHeaderReorder, TableHeaderSort } from "@thewaver/ss-components-vue";

import PageTableHeaderContent from "../../StyledComponents/TableContent/PageTableHeaderContent.vue";
import PageTableHeaderText from "../../StyledComponents/TableContent/PageTableHeaderText.vue";
import PageTableReorderGrip from "../../StyledComponents/TableContent/PageTableReorderGrip.vue";
import PageTableSortControl from "../../StyledComponents/TableContent/PageTableSortControl.vue";
import type { PageTableHeaderProps } from "./TableHeader.types";

defineProps<PageTableHeaderProps>();
</script>

<template>
    <PageTableHeaderContent :render-props="renderProps" :align="align">
        <TableHeaderReorder>
            <template #renderContent><PageTableReorderGrip /></template>
        </TableHeaderReorder>

        <PageTableHeaderText><slot /></PageTableHeaderText>

        <TableHeaderSort>
            <template #renderContent="sortRenderProps">
                <PageTableSortControl :render-props="sortRenderProps" />
            </template>
        </TableHeaderSort>
    </PageTableHeaderContent>
</template>
