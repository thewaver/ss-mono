<script setup lang="ts">
import { DEFAULT_ALIGN } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableHeaderContentProps } from "./TableContentVue.types";

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
            renderProps.pin === 'start' && styles.isPinnedStart,
            renderProps.pin === 'end' && styles.isPinnedEnd,
        ]"
    >
        <slot />
    </div>
</template>
