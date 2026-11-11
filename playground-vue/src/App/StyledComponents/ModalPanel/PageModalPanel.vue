<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { ModalPanelProps } from "./ModalPanelVue.types";

defineProps<ModalPanelProps>();

const nextLayerClass = useNextLayerClass();
</script>

<template>
    <div
        :class="[visibilityTarget === 1 ? styles.modalPanelOn : styles.modalPanelOff, nextLayerClass]"
        :style="{ transition: `transform ${transitionDurationMs}ms`, padding }"
    >
        <PageLayer><slot /></PageLayer>
    </div>
</template>
