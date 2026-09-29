<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableAlign, TableHeaderContentProps } from "./TableContent.types";

const DEFAULT_ALIGN: TableAlign = "start";

defineProps<TableHeaderContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.tableHeaderContent,
            styles.alignVariants[align ?? DEFAULT_ALIGN],
            layerClass,
            renderProps.isSortable && styles.isSortable,
            renderProps.isResizable && styles.isResizable,
            renderProps.sortDirection !== undefined && styles.isSorted,
            renderProps.isHovered && styles.isHovered,
            renderProps.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
