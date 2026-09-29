<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TabCellProps } from "./TabContent.types";

defineProps<TabCellProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.hexTab,
            layerClass,
            isSelected && styles.isSelected,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
