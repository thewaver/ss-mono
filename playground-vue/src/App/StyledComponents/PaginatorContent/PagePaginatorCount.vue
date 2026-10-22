<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorCountContentProps } from "./PaginatorContentVue.types";

defineProps<PaginatorCountContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.paginatorCount, layerClass]">{{ `${page} of ${pageCount}` }}</div>
</template>
