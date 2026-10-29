<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalOverlay/ModalOverlay.css";

import type { ModalOverlayProps } from "./ModalOverlayVue.types";

const props = defineProps<ModalOverlayProps>();

const variants = computed(() => (props.isOpaque ? styles.opaqueOverlayVariants : styles.blurredOverlayVariants));
</script>

<template>
    <div
        :class="variants[visibilityTarget === 1 ? 'on' : 'off']"
        :style="{
            transition: `backdrop-filter ${transitionDurationMs}ms, opacity ${transitionDurationMs}ms`,
        }"
    />
</template>
