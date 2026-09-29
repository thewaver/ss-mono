<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

import type { SidebarFrameProps } from "./SidebarContent.types";

defineProps<SidebarFrameProps>();
</script>

<template>
    <div :class="[styles.sidebarFrame, styles.sidebarFrameVariants[edge]]"><slot /></div>
</template>
