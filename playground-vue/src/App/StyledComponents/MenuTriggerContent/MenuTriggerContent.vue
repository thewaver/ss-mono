<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuTriggerContent/MenuTriggerContent.css";

import type { MenuTriggerContentProps } from "./MenuTriggerContent.types";

defineProps<MenuTriggerContentProps>();
</script>

<template>
    <div
        :class="[
            styles.menuTriggerContent,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isOpen && styles.isOpen,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div><slot /></div>
        <div :class="styles.menuTriggerChevron" />
    </div>
</template>
