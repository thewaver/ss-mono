<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import type { FanMenuFloaterProps } from "./FanMenuPageVue.types";

defineProps<FanMenuFloaterProps>();
</script>

<template>
    <div
        :class="[styles.itemFloater, visibilityTarget === 1 && styles.itemFloaterVisible]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
        data-floater="highlight"
    />
</template>
