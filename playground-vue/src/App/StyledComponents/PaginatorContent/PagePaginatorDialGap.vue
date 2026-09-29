<script setup lang="ts">
import PagePaginatorWedge from "./PagePaginatorWedge.vue";
import type { PaginatorDialGapContentProps } from "./PaginatorContent.types";

const GAP_MARK = "…";

defineProps<PaginatorDialGapContentProps>();
</script>

<template>
    <PagePaginatorWedge v-if="placement" :placement="placement" :is-disabled="true">
        <span :title="`Pages ${entry.from} to ${entry.to}`">{{ GAP_MARK }}</span>
    </PagePaginatorWedge>
</template>
