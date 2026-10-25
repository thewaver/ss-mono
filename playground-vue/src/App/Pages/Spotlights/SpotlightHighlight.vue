<script setup lang="ts">
import { CornerHighlight } from "@thewaver/ss-components-vue";

import type { SpotlightHighlightProps } from "./SpotlightsVue.types";

defineProps<SpotlightHighlightProps>();
</script>

<template>
    <CornerHighlight :color="visibilityTarget === 1 ? 'yellow' : 'transparent'" />
</template>
