<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ToggleContent/ToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ToggleContentProps } from "./ToggleContent.types";

defineProps<ToggleContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.toggleContent,
            layerClass,
            flags.checkedState === true && styles.isChecked,
            flags.checkedState === 'mixed' && styles.isMixed,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
    >
        <div :class="styles.toggleHandle" />
    </div>
</template>
