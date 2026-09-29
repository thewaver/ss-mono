<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TabContentProps } from "./TabContent.types";

defineProps<TabContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            orientation === 'horizontal' ? styles.rowTab : styles.columnTab,
            layerClass,
            isSelected && styles.isSelected,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
