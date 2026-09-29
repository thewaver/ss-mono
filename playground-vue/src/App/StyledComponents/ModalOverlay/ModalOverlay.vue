<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalOverlay/ModalOverlay.css";

import type { ModalOverlayProps } from "./ModalOverlay.types";

defineProps<ModalOverlayProps>();
</script>

<template>
    <div
        :class="visibilityTarget === 1 ? styles.overlayOn : styles.overlayOff"
        :style="{
            transition: `backdrop-filter ${transitionDurationMs}ms`,
        }"
    />
</template>
