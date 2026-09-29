<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DrawerPanel/DrawerPanel.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { DrawerPanelProps } from "./DrawerPanel.types";

defineProps<DrawerPanelProps>();
</script>

<template>
    <div
        :class="[
            styles.drawerPanel,
            styles.drawerSizeVariants[edge],
            visibilityTarget === 1 ? styles.drawerSlideOn : styles.drawerSlideOffVariants[edge],
        ]"
        :style="{ transition: `transform ${transitionDurationMs}ms` }"
    >
        <PageLayer :level="1"><slot /></PageLayer>
    </div>
</template>
