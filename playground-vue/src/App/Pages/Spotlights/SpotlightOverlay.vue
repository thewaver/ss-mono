<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import type { SpotlightOverlayProps } from "./Spotlights.types";

defineProps<SpotlightOverlayProps>();
</script>

<template>
    <div
        :class="visibilityTarget === 1 ? styles.overlayOn : styles.overlayOff"
        :style="[
            maskStyle,
            { transition: `background-color ${transitionDurationMs}ms, backdrop-filter ${transitionDurationMs}ms` },
        ]"
    />
</template>
