<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableOfContentsContent/TableOfContentsContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import type { TableOfContentsContentProps } from "./TableOfContentsContent.types";

defineProps<TableOfContentsContentProps>();
</script>

<template>
    <span
        :class="[
            styles.tableOfContentsContent,
            flags.isCurrent && styles.isCurrent,
            flags.isHovered && styles.isHovered,
        ]"
        :style="{
            marginInlineStart: `calc(${themeVars.spacing.double} * ${depth})`,
        }"
    >
        <slot />
    </span>
</template>
