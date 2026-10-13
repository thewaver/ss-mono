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
        ]"
    >
        <div :class="styles.tableText"><slot /></div>
    </div>
</template>
