<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import PageLayer from "../../../PageComponents/Layer/Layer.vue";
import type { FanMenuPopupProps } from "./FanMenuPageVue.types";

defineProps<FanMenuPopupProps>();
</script>

<template>
    <div
        :class="[styles.layer, visibilityTarget === 1 && styles.layerVisible]"
        :style="{ transition: `opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms` }"
    >
        <PageLayer :level="2"><component :is="renderItems" /></PageLayer>
    </div>
</template>
