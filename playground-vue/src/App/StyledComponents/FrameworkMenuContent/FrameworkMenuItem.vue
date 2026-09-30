<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FrameworkMenuItemProps } from "./FrameworkMenuContent.types";

defineProps<FrameworkMenuItemProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.selectOptionContent,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isHighlighted && styles.isHighlighted,
            flags.isChecked && styles.isSelected,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div><slot /></div>

        <div :class="styles.selectOptionMark" aria-hidden="true">✓</div>
    </div>
</template>
