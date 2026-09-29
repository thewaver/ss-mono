<script setup lang="ts">
import PagePaginatorWedge from "./PagePaginatorWedge.vue";
import type { PaginatorPageContentProps } from "./PaginatorContent.types";

defineProps<PaginatorPageContentProps>();
</script>

<template>
    <PagePaginatorWedge
        v-if="renderProps.placement"
        :placement="renderProps.placement"
        :is-current="renderProps.isCurrent"
        :is-hovered="renderProps.isHovered ?? false"
        :is-active="renderProps.isActive ?? false"
        :is-disabled="renderProps.isDisabled ?? false"
    >
        {{ renderProps.page }}
    </PagePaginatorWedge>
</template>
