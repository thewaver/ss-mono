<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import PageLayer from "../../../PageComponents/Layer/Layer.vue";
import type { WheelMenuPopupProps } from "./WheelMenuPageVue.types";

defineProps<WheelMenuPopupProps>();
</script>

<template>
    <div
        :class="[styles.layer, visibilityTarget === 1 && styles.layerVisible]"
        :style="{ transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms` }"
    >
        <PageLayer :level="2"><component :is="renderItems" /></PageLayer>
    </div>
</template>
