<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { ModalPanelProps } from "./ModalPanel.types";

defineProps<ModalPanelProps>();
</script>

<template>
    <div
        :class="visibilityTarget === 1 ? styles.modalPanelOn : styles.modalPanelOff"
        :style="{ transition: `transform ${transitionDurationMs}ms`, padding }"
    >
        <PageLayer :level="1"><slot /></PageLayer>
    </div>
</template>
