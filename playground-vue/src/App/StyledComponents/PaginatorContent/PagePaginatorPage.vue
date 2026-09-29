<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorPageContentProps } from "./PaginatorContent.types";

defineProps<PaginatorPageContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.paginatorPage,
            layerClass,
            renderProps.isCurrent && styles.isCurrent,
            renderProps.isHovered && styles.isHovered,
            renderProps.isActive && styles.isActive,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ renderProps.page }}
    </div>
</template>
