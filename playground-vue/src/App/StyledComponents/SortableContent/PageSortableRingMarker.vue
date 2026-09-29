<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.sortableRingMarker, layerClass]" data-marker="" />
</template>
