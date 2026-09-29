<script setup lang="ts">
import type { ColorAreaRenderProps, InteractionFlags } from "@thewaver/ss-components-vue";

import PageColorAreaContent from "../../StyledComponents/ColorAreaContent/PageColorAreaContent.vue";

const AREA_SIZE = 160;

defineProps<{ renderProps: InteractionFlags<ColorAreaRenderProps> }>();
</script>

<template>
    <PageColorAreaContent :render-props="renderProps" :size="AREA_SIZE" />
</template>
