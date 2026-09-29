<script setup lang="ts">
import type { TableSortDirection } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableResizerProps } from "./TableContent.types";

const UNSORTED_MARKER = "↕";

const SORT_MARKERS: Record<TableSortDirection, string> = {
    ascending: "▲",
    descending: "▼",
};

const getSortMarker = (direction: TableSortDirection | undefined) =>
    direction === undefined ? UNSORTED_MARKER : SORT_MARKERS[direction];

defineProps<TableResizerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.tableSortMarker, layerClass]">
        {{ getSortMarker(renderProps.sortDirection) }}
    </div>
</template>
