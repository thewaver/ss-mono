<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ButtonContent/ButtonContent.css";

import type { ButtonContentProps } from "./ButtonContent.types";

defineProps<ButtonContentProps>();
</script>

<template>
    <div
        :class="[
            styles.buttonContent,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
    >
        <slot />
    </div>
</template>
