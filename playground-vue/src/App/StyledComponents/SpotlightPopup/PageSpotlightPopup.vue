<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { SpotlightPopupProps } from "./SpotlightPopup.types";

defineProps<SpotlightPopupProps>();
</script>

<template>
    <div
        :class="styles.spotlightPopup"
        :style="{
            opacity: visibilityTarget,
            transition: `opacity ${transitionDurationMs}ms`,
        }"
    >
        <div :class="styles.spotlightPopupTitle">{{ title }}</div>
        <PageLayer :level="2"><slot /></PageLayer>
    </div>
</template>
