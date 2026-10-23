<script setup lang="ts">
import { DEFAULT_ALIGN } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableCellContentProps } from "./TableContentVue.types";

defineProps<TableCellContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.tableCellContent,
            styles.alignVariants[align ?? DEFAULT_ALIGN],
            layerClass,
            renderProps.isHovered && styles.isHovered,
            renderProps.isSelected && styles.isSelected,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.pin === 'start' && styles.isPinnedStart,
            renderProps.pin === 'end' && styles.isPinnedEnd,
            renderProps.isExpanded && styles.isExpanded,
        ]"
    >
        <div v-if="$slots.leading" :class="styles.tableCellLeading"><slot name="leading" /></div>

        <div :class="styles.tableText"><slot /></div>
    </div>
</template>
