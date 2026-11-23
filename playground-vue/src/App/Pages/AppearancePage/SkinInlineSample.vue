<script setup lang="ts">
import {
    SKIN_SAMPLE_INLINE_FLAGS,
    SKIN_SAMPLE_INLINE_HOVERED_FLAGS,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";

import PageInlineEditContent from "../../StyledComponents/InlineEditContent/InlineEditContent.vue";
import type { SkinStateProps } from "./AppearancePage.types";

defineProps<SkinStateProps>();
</script>

<template>
    <PageInlineEditContent :flags="isHovered ? SKIN_SAMPLE_INLINE_HOVERED_FLAGS : SKIN_SAMPLE_INLINE_FLAGS">
        {{ state }}
    </PageInlineEditContent>
</template>
