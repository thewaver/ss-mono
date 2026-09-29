<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorGapContentProps } from "./PaginatorContent.types";

defineProps<PaginatorGapContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.paginatorGap, layerClass]" :title="`Pages ${entry.from} to ${entry.to}`">…</div>
</template>
