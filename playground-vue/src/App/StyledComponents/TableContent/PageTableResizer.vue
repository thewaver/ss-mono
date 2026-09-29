<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableResizerProps } from "./TableContent.types";

defineProps<TableResizerProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.tableResizerHandle, layerClass, renderProps.isResizing && styles.isResizing]"
        aria-hidden="true"
    />
</template>
