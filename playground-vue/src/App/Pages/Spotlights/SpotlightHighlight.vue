<script setup lang="ts">
import { Corners } from "@thewaver/ss-components-vue";

import type { SpotlightHighlightProps } from "./Spotlights.types";

defineProps<SpotlightHighlightProps>();
</script>

<template>
    <Corners :color="visibilityTarget === 1 ? 'yellow' : 'transparent'" />
</template>
