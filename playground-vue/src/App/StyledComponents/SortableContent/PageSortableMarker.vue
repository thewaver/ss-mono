<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableMarkerProps } from "./SortableContent.types";

defineProps<SortableMarkerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[orientation === 'horizontal' ? styles.sortableMarkerRow : styles.sortableMarkerColumn, layerClass]" />
</template>
