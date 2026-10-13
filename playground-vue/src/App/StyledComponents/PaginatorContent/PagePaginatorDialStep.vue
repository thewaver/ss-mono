<script setup lang="ts">
import { STEP_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";

import PagePaginatorWedge from "./PagePaginatorWedge.vue";
import type { PaginatorStepContentProps } from "./PaginatorContentVue.types";

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
