<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import type { PageBracketLayerHeaderProps } from "./BracketPage.types";

defineProps<PageBracketLayerHeaderProps>();
</script>

<template>
    <div :class="styles.layerHeader">{{ names[layer] }}</div>
</template>
