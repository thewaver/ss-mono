<script setup lang="ts">
import type { ColorAreaRenderProps, InteractionFlags } from "@thewaver/ss-components-vue";
import { AREA_SIZE } from "@thewaver/ss-playground/App/PageComponents/ColorPicker/ColorPicker.const";

import PageColorAreaContent from "../../StyledComponents/ColorAreaContent/PageColorAreaContent.vue";

defineProps<{ renderProps: InteractionFlags<ColorAreaRenderProps> }>();
</script>

<template>
    <PageColorAreaContent :render-props="renderProps" :size="AREA_SIZE" />
</template>
