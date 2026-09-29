<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { HoverCardContentProps } from "./HoverCardContent.types";

defineProps<HoverCardContentProps>();
</script>

<template>
    <div
        :class="[styles.hoverCardContent, visibilityTarget === 1 && styles.isVisible]"
        :style="{ transition: `opacity ${transitionDurationMs}ms` }"
    >
        <PageLayer :level="2"><slot /></PageLayer>
    </div>
</template>
