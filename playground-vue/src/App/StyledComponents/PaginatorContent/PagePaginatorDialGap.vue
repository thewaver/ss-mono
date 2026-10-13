<script setup lang="ts">
import { GAP_MARK } from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";

import PagePaginatorWedge from "./PagePaginatorWedge.vue";
import type { PaginatorDialGapContentProps } from "./PaginatorContentVue.types";

defineProps<PaginatorDialGapContentProps>();
</script>

<template>
    <PagePaginatorWedge v-if="placement" :placement="placement" :is-disabled="true">
        <span :title="`Pages ${entry.from} to ${entry.to}`">{{ GAP_MARK }}</span>
    </PagePaginatorWedge>
</template>
