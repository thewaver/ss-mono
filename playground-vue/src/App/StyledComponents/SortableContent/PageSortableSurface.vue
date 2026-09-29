<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableSurfaceProps } from "./SortableContent.types";

defineProps<SortableSurfaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.sortableSurface,
            layerClass,
            flags.isReceiving && styles.isReceiving,
            flags.isCarrying && styles.isCarrying,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div v-if="flags.isEmpty" :class="styles.sortableEmpty">{{ emptyText }}</div>
    </div>
</template>
