<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectContent/SelectContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectContentProps } from "./SelectContentVue.types";

defineProps<SelectContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.selectContent,
            layerClass,
            flags.isEmpty && styles.isEmpty,
            flags.isFiltering && styles.isFiltering,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isOpen && styles.isOpen,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
        :style="{ width: width ? `${width}px` : undefined }"
    >
        <div :class="styles.selectValue"><slot /></div>
        <div v-if="hasClearSpace && !flags.isEmpty" :class="styles.selectClearSpace" />
        <div :class="styles.selectChevron" />
    </div>
</template>
