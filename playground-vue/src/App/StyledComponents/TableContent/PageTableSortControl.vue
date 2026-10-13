<script setup lang="ts">
import type { TableSortDirection } from "@thewaver/ss-components-vue";
import {
    SORT_MARKERS,
    UNSORTED_MARKER,
} from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableResizerProps } from "./TableContentVue.types";

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
