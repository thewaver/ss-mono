<script setup lang="ts">
import type { PaginatorStep } from "@thewaver/ss-components-vue";

import PagePaginatorWedge from "./PagePaginatorWedge.vue";
import type { PaginatorStepContentProps } from "./PaginatorContent.types";

const STEP_GLYPHS: Record<PaginatorStep, string> = {
    first: "«",
    previous: "‹",
    next: "›",
    last: "»",
};

defineProps<PaginatorStepContentProps>();
</script>

<template>
    <PagePaginatorWedge
        v-if="renderProps.placement"
        :placement="renderProps.placement"
        :is-hovered="renderProps.isHovered ?? false"
        :is-active="renderProps.isActive ?? false"
        :is-disabled="renderProps.isDisabled ?? false"
    >
        {{ STEP_GLYPHS[renderProps.step] }}
    </PagePaginatorWedge>
</template>
