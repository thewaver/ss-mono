<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableGridSurfaceProps } from "./SortableGridContent.types";

defineProps<SortableGridSurfaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.sortableGridSurface,
            layerClass,
            flags.isReceiving && styles.isReceiving,
            flags.isCarrying && styles.isCarrying,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div v-if="flags.isEmpty" :class="styles.sortableGridEmpty">{{ emptyText }}</div>
    </div>
</template>
