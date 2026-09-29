<script setup lang="ts">
import type { InteractionFlags, RangeRenderProps } from "@thewaver/ss-components-vue";

import PageHueSlider from "../../StyledComponents/ColorAreaContent/PageHueSlider.vue";

defineProps<{ renderProps: InteractionFlags<RangeRenderProps> }>();
</script>

<template>
    <PageHueSlider :render-props="renderProps" />
</template>
