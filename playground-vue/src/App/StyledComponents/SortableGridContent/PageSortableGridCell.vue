<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableGridCellProps } from "./SortableGridContent.types";

defineProps<SortableGridCellProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.sortableGridCell,
            layerClass,
            (spot.col + spot.row) % 2 === 1 && styles.isOdd,
            (isBlocked ?? false) && styles.isBlocked,
        ]"
    />
</template>
