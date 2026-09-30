<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FrameworkMenuContent/FrameworkMenuContent.css";

import type { FrameworkMenuTriggerProps } from "./FrameworkMenuContent.types";

defineProps<FrameworkMenuTriggerProps>();
</script>

<template>
    <span :class="[styles.frameworkMenuTrigger, flags.isHovered && styles.isHovered, flags.isOpen && styles.isOpen]">
        <span :class="styles.frameworkMenuName"><slot /></span>

        <span :class="styles.frameworkMenuChevron" aria-hidden="true">{{ flags.isOpen ? "▴" : "▾" }}</span>
    </span>
</template>
